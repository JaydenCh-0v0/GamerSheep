extends Node
class_name EnergyManager

@export var start_energy: int = 20
@export var energy_label: Label 

var energy:
	set(value):
		energy = value
		energy_label.text = "Energy: \t" + str(value)

func _ready() -> void: 
	energy = start_energy
