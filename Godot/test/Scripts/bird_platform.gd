extends StaticBody2D

var is_placeable: bool = true
var obj_hover: int = 0

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	modulate = Color(Color.MEDIUM_SPRING_GREEN, 0.7)
	add_to_group("dropable_platform")

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	if Global.is_dragging:
		update_platform_color()
		visible = true
	else:
		visible = false

func set_placeable(value: bool) -> void:
	is_placeable = value
	
func check_placeable() -> bool:
	return is_placeable

func update_platform_color() -> void:
	if is_placeable: 
		if obj_hover > 0: 
			modulate = Color(Color.MEDIUM_SPRING_GREEN, 0.7)
		else:
			modulate = Color(Color.MEDIUM_SPRING_GREEN, 0.4)
	else: 
		modulate = Color(Color.MEDIUM_VIOLET_RED, 0.4)
