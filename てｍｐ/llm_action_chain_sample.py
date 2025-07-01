import re
import requests

# 村人AIの状態
state = {
    "location": "plaza",
    "you_has_crop": False,
    "village_crop": 0,
    "field_has_crop": False,  # 畑に作物が植えられているか
}

# 行動候補（状況に応じて変わる）
actions = [
    "move_to_field",
    "move_to_warehouse",
    "move_to_plaza",
    "plant_crop",
    "harvest_crop",
    "store_crop",
    "stop"  # やめる
]

def get_action_availability(state):
    """
    入力: state (dict) 例:
        {
            "location": "plaza",
            "has_crop": False,
            "village_crop": 0,
        }
    出力:
        {
            "can": [できる行動のリスト],
            "cannot": [
                {"action": 行動名, "reason": 理由},
                ...
            ]
        }
    """
    location = state.get("location")
    has_crop = state.get("you_has_crop", False)
    field_has_crop = state.get("field_has_crop", False)
    can = []
    cannot = []

    # 移動は常に可能（ただし現在地以外にのみ）
    for place in ["field", "warehouse", "plaza"]:
        action = f"move_to_{place}"
        if location == place:
            cannot.append({"action": action, "reason": f"既に{place}にいるため移動できません。"})
        else:
            can.append(action)

    # plant_crop: 畑にいて、作物を持っていなくて、畑に作物が植えられていないときのみ
    if location == "field" and not has_crop and not field_has_crop:
        can.append("plant_crop")
    else:
        reason = ""
        if location != "field":
            reason = "畑にいないため作物を植えられません。"
        elif has_crop:
            reason = "既に作物を持っているため植えられません。"
        elif field_has_crop:
            reason = "畑に既に作物が植えられています。"
        cannot.append({"action": "plant_crop", "reason": reason})

    # harvest_crop: 畑にいて、作物を持っていなくて、畑に作物が植えられているときのみ
    if location == "field" and not has_crop and field_has_crop:
        can.append("harvest_crop")
    else:
        reason = ""
        if location != "field":
            reason = "畑にいないため作物を収穫できません。"
        elif has_crop:
            reason = "既に作物を持っているため収穫できません。"
        elif not field_has_crop:
            reason = "畑に作物が植えられていません。"
        cannot.append({"action": "harvest_crop", "reason": reason})

    # store_crop: 倉庫にいて、作物を持っているときのみ
    if location == "warehouse" and has_crop:
        can.append("store_crop")
    else:
        reason = ""
        if location != "warehouse":
            reason = "倉庫にいないため作物をしまえません。"
        elif not has_crop:
            reason = "作物を持っていないためしまえません。"
        cannot.append({"action": "store_crop", "reason": reason})

    can.append("stop")  # いつでもやめることは可能
    return {"can": can, "cannot": cannot}

# 行動を状態に反映する関数
def apply_action(state, action):
    if action == "stop":
        return state  # 状態は変えない
    new_state = state.copy()
    if action == "move_to_field":
        new_state["location"] = "field"
    elif action == "move_to_warehouse":
        new_state["location"] = "warehouse"
    elif action == "move_to_plaza":
        new_state["location"] = "plaza"
    elif action == "plant_crop":
        if new_state["location"] == "field" and not new_state["you_has_crop"] and not new_state["field_has_crop"]:
            new_state["field_has_crop"] = True
    elif action == "harvest_crop":
        if new_state["location"] == "field" and not new_state["you_has_crop"] and new_state["field_has_crop"]:
            new_state["you_has_crop"] = True
            new_state["field_has_crop"] = False
    elif action == "store_crop":
        if new_state["location"] == "warehouse" and new_state["you_has_crop"]:
            new_state["you_has_crop"] = False
            new_state["village_crop"] += 1
    return new_state

# AI返答から行動をパースする関数
def parse_action(response_text):
    # レスポンス全体を前からなめていき、最初に現れるactionを返す
    best = None  # (index, action)
    for act in actions:
        match = re.search(r'\b' + re.escape(act) + r'\b', response_text)
        if match:
            idx = match.start()
            if best is None or idx < best[0]:
                best = (idx, act)
    if best:
        return best[1]
    return None

print(get_action_availability({
    "location": "warehouse",
    "you_has_crop": True,
    "village_crop": 0,
    "field_has_crop": False,  # 畑に作物が植えられているか
}))

OLLAMA_API_URL = "http://ollama:11434/api/generate"
player_command = "作物を稼いでください。"

max_steps = 10

prev_state = None
prev_action = None
history = []
for step in range(max_steps):
    state_jp = f"状態: {state} "
    actions_jp = get_action_availability(state)
    prompt_parts = []
    if step > 0 and history:
        # 履歴を日本語で要約
        history_summary = "\n".join([
            f"Step{i+1}: {h['action']} → {h['state']}" for i, h in enumerate(history)
        ])
        prompt_parts.append(f"【これまでの行動履歴】\n{history_summary}")
    if prev_state is not None and prev_action is not None:
        prev_state_jp = f"現在地: {prev_state['location']} / あなたが作物を持っているか: {prev_state['you_has_crop']} / 村全体の作物数: {prev_state['village_crop']} / 畑に作物が植えられているか: {prev_state['field_has_crop']}"
        prompt_parts.append(f"【前回の状態】\n{prev_state_jp}\n【前回選んだ行動】{prev_action}\n【前回の行動の結果（新しい状態）】\n{state_jp}")
    prompt_parts.append(f"あなたは村人AIです。\n\n【現在の状態】\n{state_jp}\n\n【行動候補】\ncan: {actions_jp['can']}\ncannot: {actions_jp['cannot']}\n\nプレイヤーからの指示: 「{player_command}」\n\nこれまでの行動履歴と結果を参考に、canリストの各行動についてプレイヤーの要求を満たすにはどうすればよいか考察してください。その上で、最も適切な行動を1つ選び、最後に「選んだ行動: XXX」と明記してください。\n")
    llm_prompt = "\n".join(prompt_parts)
    payload = {
        "model": "7shi/ezo-gemma-2-jpn:2b-instruct-q8_0",
        "prompt": llm_prompt,
        "stream": False
    }
    print(f"\n=== Step {step+1} ===")
    print("[Prompt]\n", llm_prompt)
    response = requests.post(OLLAMA_API_URL, json=payload)
    if response.ok:
        ai_response = response.json().get("response")
        print("[AI Response]\n", ai_response)
        match = re.search(r'選んだ行動[:：]\s*([a-zA-Z0-9_]+)', ai_response)
        if match and match.group(1) in actions:
            action = match.group(1)
        else:
            action = parse_action(ai_response)
        if action and action in actions:
            prev_state = state.copy()
            prev_action = action
            state = apply_action(state, action)
            history.append({"action": action, "state": state.copy()})
            print(f"[Action] {action} を実行しました。新しい状態: {state}")
            if state["village_crop"] >= 1:
                print("[Goal] 村全体の作物数が増えました！シミュレーション終了。")
                break
        else:
            print("[Error] 行動がパースできませんでした。終了します。")
            break
    else:
        print("エラー:", response.text)
        break