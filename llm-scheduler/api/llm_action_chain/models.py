from dataclasses import dataclass

@dataclass
class State:
    name: str
    description: str

@dataclass
class Action:
    name: str
    description: str
