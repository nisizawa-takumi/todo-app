import re
import requests
from typing import Optional, Dict, Any, List, Tuple
from llm_action_chain.models import State
from llm_action_chain.actions import ACTIONS, apply_action, state_to_description
from llm_action_chain.action_utils import get_action_availability

# === Configurations / 設定値 ===
OLLAMA_API_URL = "http://ollama:11434/api/generate"  # LLM API URL / LLM APIのURL
MODEL_NAME = "gemma3:4b"  # Model name / 使用するモデル名
PLAYER_COMMAND = "農家として動きなさい。"  # Player command / プレイヤーからの指示
MAX_STEPS = 30  # Max steps / 最大ステップ数


def main():
    """
    Main simulation loop.
    村人AIが作物を村に届けるまでの流れを繰り返すメイン処理。
    """
    state = create_initial_state()
    prev_state = None
    prev_action = None
    history = []

    for step in range(1, MAX_STEPS + 1):
        state["description"] = state_to_description_en(state)
        actions_info = get_action_availability_en(state)
        prompt = build_prompt(state, actions_info, prev_state, prev_action, history)

        print(f"\n=== Step {step} ===")
        print("[Prompt]\n", prompt)
        ai_response = call_llm(prompt)
        if ai_response is None:
            print("[Error] No response from AI. / AIから応答がありません。終了します。")
            break
        print("[AI Response]\n", ai_response)
        action = extract_action_from_response(ai_response)
        if action and action in [a.name for a in ACTIONS]:
            prev_state = state.copy()
            prev_action = action
            new_state, changed = apply_action_to_state(state, action)
            new_state["description"] = state_to_description_en(new_state)
            state = new_state
            note = "Action failed" if not changed else ""
            history.append({
                "action": action,
                "state": state.copy(),
                "ai_output": ai_response,
                "note": note
            })
            print(f"[Action] {action} executed. New state: {state['description']}" + (f" ({note})" if note else ""))
            if state["village_crop_count"] >= 1:
                print("[Goal] Village crop count increased! Simulation finished. / 村全体の作物数が増えました！シミュレーション終了。")
                break
        else:
            print("[Error] Could not parse action. / 行動がパースできませんでした。終了します。")
            break

# === Utility functions / 補助関数 ===

def create_initial_state() -> Dict[str, Any]:
    """
    Create the initial state for the villager.
    村人の初期状態を返す。
    """
    return {
        "location": "at_warehouse",
        "holding": "not_holding_crop",
        "field": "field_empty",
        "village_crop_count": 0
    }

def state_to_description_en(state: Dict[str, Any]) -> str:
    """
    Convert state to a human-readable description.
    状態を説明文に変換。
    """
    return state_to_description(state)

def get_action_availability_en(state: Dict[str, Any]) -> Dict[str, List[Dict[str, str]]]:
    """
    Get available and unavailable actions for the current state.
    今の状態でできる行動・できない行動を取得。
    """
    return get_action_availability(state)

def build_prompt(
    state: Dict[str, Any],
    actions_info: Dict[str, List[Dict[str, str]]],
    prev_state: Optional[Dict[str, Any]],
    prev_action: Optional[str],
    history: List[Dict[str, Any]]
) -> str:
    """
    Build the prompt for the LLM.
    LLMに渡すプロンプトを組み立てる。
    """
    parts = [
        "You are a villager AI capable of logical reasoning. Learn from failures and choose the optimal action. "
    ]
    if prev_state and prev_action:
        parts.append(
            f"[Previous state]\n{prev_state['description']}\n[Previous action] {prev_action}\n[Resulting state]\n{state['description']}"
        )
    if history:
        parts.append(f"[History so far]\n{format_history(history)}")
    can_actions = '\n'.join(
        f"- {a['action']}: {next((act.description for act in ACTIONS if act.name == a['action']), '')}"
        for a in actions_info['can']
    )
    cannot_actions = '\n'.join(
        f"- {a['action']}: {a['reason']}" for a in actions_info['cannot']
    )
    parts.append(
        f"\n\n[Current state]\n{state['description']}"
        f"\n\n[Action candidates]\n[can]\n{can_actions}\n[cannot]\n{cannot_actions}"
        f"\n\n[Rules]\nChoose only one action from the 'can' list. Selecting an action from the 'cannot' list means the action will fail. You must avoid failed actions."
        f"\n\nPlayer command: '{PLAYER_COMMAND}'"
        f"\n\nPlease carry out the following tasks in order."
    )
    if history:parts.append("\n-Reflect on the [History so far].")
    parts.append(
        "\n-Infer what the player wants."
        "\n\n-Guess what is required and output 'Chosen action: XXX' with the action name."
    )
    return "\n".join(parts)

def format_history(history: List[Dict[str, Any]]) -> str:
    """
    Format the action history for display.
    行動履歴を見やすい形に整形。
    """
    lines = []
    for i, h in enumerate(history):
        ai_output_last = h.get('ai_output', '').strip().splitlines()[-1] if h.get('ai_output') else ''
        note = f" {h['note']}!" if h.get('note') else ''
        lines.append(f"Step{i+1}:\n{h['state']['description']}\nAI output: {ai_output_last}\nAction → {h['action']}{note}")
    return "\n".join(lines)

def call_llm(prompt: str) -> Optional[str]:
    """
    Send prompt to LLM API and return the response.
    LLM APIにプロンプトを送り、応答を返す。
    """
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False
    }
    try:
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=60)
        response.raise_for_status()
        return response.json().get("response", "")
    except Exception as e:
        print(f"[Error] API request failed: {e} / APIリクエスト失敗: {e}")
        return None

def extract_action_from_response(response_text: str) -> Optional[str]:
    """
    Extract the last occurring action name from the AI output.
    AIの出力から最後に出現した行動名（action名）を抜き出す。
    """
    candidates = [
        (m.start(), act.name)
        for act in ACTIONS
        for m in re.finditer(re.escape(act.name), response_text)
    ]
    if candidates:
        return max(candidates, key=lambda x: x[0])[1]
    return None

def apply_action_to_state(state: Dict[str, Any], action_name: str) -> Tuple[Dict[str, Any], bool]:
    """
    Apply the specified action to the state and return the new state and whether it changed.
    指定した行動を状態に適用し、新しい状態と変化有無を返す。
    """
    return apply_action(state, action_name)

if __name__ == "__main__":
    main()