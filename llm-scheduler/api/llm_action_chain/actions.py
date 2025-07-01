from typing import List, Dict, Callable, Tuple
from .models import State, Action

# Define all possible states and actions as name/description pairs
STATES: List[State] = [
    State("at_field", "The villager is at the field."),
    State("at_warehouse", "The villager is at the warehouse."),
    State("at_plaza", "The villager is at the plaza."),
    State("holding_crop", "The villager is holding a crop."),
    State("not_holding_crop", "The villager is not holding any crop."),
    State("field_has_crop", "There is a crop planted in the field."),
    State("field_empty", "There is no crop planted in the field."),
    # village_crop_count is handled as an int elsewhere
]

ACTIONS: List[Action] = [
    Action("move_to_field", "Move the villager to the field."),
    Action("move_to_warehouse", "Move the villager to the warehouse."),
    Action("move_to_plaza", "Move the villager to the plaza."),
    Action("plant_crop", "Plant a crop in the field."),
    Action("harvest_crop", "Harvest the crop from the field."),
    Action("store_crop", "Store the crop in the village warehouse."),
]

# Example of a simple state dict for simulation
# state = {"location": "at_field", "holding": "holding_crop", "field": "field_has_crop", "village_crop_count": 0}

def move_to_field_available(state: Dict) -> Tuple[bool, str]:
    if state["location"] == "at_field":
        return False, "Already at the field."
    return True, "Move the villager to the field."

def move_to_warehouse_available(state: Dict) -> Tuple[bool, str]:
    if state["location"] == "at_warehouse":
        return False, "Already at the warehouse."
    return True, "Move the villager to the warehouse."

def move_to_plaza_available(state: Dict) -> Tuple[bool, str]:
    if state["location"] == "at_plaza":
        return False, "Already at the plaza."
    return True, "Move the villager to the plaza."

def plant_crop_available(state: Dict) -> Tuple[bool, str]:
    if state["location"] != "at_field":
        return False, "The villager must be at the field to plant a crop."
    if state["field"] == "field_has_crop":
        return False, "There is already a crop planted in the field."
    return True, "Plant a crop in the field."

def harvest_crop_available(state: Dict) -> Tuple[bool, str]:
    if state["location"] != "at_field":
        return False, "The villager must be at the field to harvest."
    if state["holding"] == "holding_crop":
        return False, "The villager is already holding a crop."
    if state["field"] == "field_empty":
        return False, "There is no crop to harvest."
    return True, "Harvest the crop from the field."

def store_crop_available(state: Dict) -> Tuple[bool, str]:
    if state["location"] != "at_warehouse":
        return False, "The villager must be at the warehouse to store the crop."
    if state["holding"] == "not_holding_crop":
        return False, "The villager is not holding a crop to store."
    return True, "Store the crop in the village warehouse."

ACTION_AVAILABILITY: Dict[str, Callable[[Dict], Tuple[bool, str]]] = {
    "move_to_field": move_to_field_available,
    "move_to_warehouse": move_to_warehouse_available,
    "move_to_plaza": move_to_plaza_available,
    "plant_crop": plant_crop_available,
    "harvest_crop": harvest_crop_available,
    "store_crop": store_crop_available,
}

def apply_action(state: Dict, action_name: str):
    new_state = state.copy()
    changed = False
    if action_name == "move_to_field":
        if new_state["location"] != "at_field":
            new_state["location"] = "at_field"
            changed = True
    elif action_name == "move_to_warehouse":
        if new_state["location"] != "at_warehouse":
            new_state["location"] = "at_warehouse"
            changed = True
    elif action_name == "move_to_plaza":
        if new_state["location"] != "at_plaza":
            new_state["location"] = "at_plaza"
            changed = True
    elif action_name == "plant_crop":
        if new_state["location"] == "at_field" and new_state["field"] == "field_empty":
            new_state["field"] = "field_has_crop"
            changed = True
    elif action_name == "harvest_crop":
        if new_state["location"] == "at_field" and new_state["field"] == "field_has_crop" and new_state["holding"] == "not_holding_crop":
            new_state["holding"] = "holding_crop"
            new_state["field"] = "field_empty"
            changed = True
    elif action_name == "store_crop":
        if new_state["location"] == "at_warehouse" and new_state["holding"] == "holding_crop":
            new_state["holding"] = "not_holding_crop"
            new_state["village_crop_count"] += 1
            changed = True
    return new_state, changed


def state_to_description(state: dict) -> str:
    loc = {
        "at_field": "The villager is at the field.",
        "at_warehouse": "The villager is at the warehouse.",
        "at_plaza": "The villager is at the plaza."
    }.get(state["location"], "Unknown location.")
    holding = {
        "holding_crop": "holding a crop",
        "not_holding_crop": "not holding any crop"
    }.get(state["holding"], "unknown crop status")
    field = {
        "field_has_crop": "There is a crop planted in the field.",
        "field_empty": "There is no crop planted in the field."
    }.get(state["field"], "Unknown field status.")
    village = f"The total number of crops stored in the village warehouse is {state['village_crop_count']}."
    return f"{loc} The villager is {holding}. {field} {village}"
