extends Control
class_name CardTemplate

@export var card_res: cardRes
@onready var card_light: TextureRect = $Light
@onready var card_dark: TextureRect = $Dark
@onready var card_cool_progress: ProgressBar = $Dark/CoolingBar

var cd_time := 0.0
var is_sun_enough := false
var is_click := false
var is_plant := false
var is_disabled := false

signal card_click
signal card_plant

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	card_light.texture = card_res.card_light
	card_dark.texture = card_res.card_dark
	print("ready")
