from typing import Dict, Any, List
from .models import State, Action
from .actions import ACTIONS, ACTION_AVAILABILITY

def get_action_availability(state: Dict) -> Dict[str, List[Dict[str, str]]]:
    can = []
    cannot = []
    for action in ACTIONS:
        available, reason_or_desc = ACTION_AVAILABILITY[action.name](state)
        if available:
            can.append({"action": action.name, "description": action.description})
        else:
            cannot.append({"action": action.name, "reason": reason_or_desc})
    return {"can": can, "cannot": cannot}
