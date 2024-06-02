extends Camera2D
@onready var camera_2d = $"."

var zoom_speed = 100
var zoom_margin = 0.3
var zoom_min = 2
var zoom_max = 16

var zoom_pos = Vector2()
var zoom_factor = 1.0

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	zoom.x = lerp(zoom.x, zoom.x * zoom_factor, zoom_speed * delta)
	zoom.y = lerp(zoom.y, zoom.y * zoom_factor, zoom_speed * delta)
	
	zoom.x = clamp(zoom.x, zoom_min, zoom_max)
	zoom.y = clamp(zoom.y, zoom_min, zoom_max)	
	zoom_factor = 1.0	

func _input(event):

	if (Input.is_action_just_pressed("zoom_in")):
		print("zoom_in")
		zoom_factor += 0.01
		zoom_pos = get_global_mouse_position()
	if (Input.is_action_just_pressed("zoom_out")):
		print("zoom_out")
		zoom_factor -= 0.01
		zoom_pos = get_global_mouse_position()		
	if (Input.is_action_just_pressed("zoom_reset")):
		print("zoom_reset")
		zoom.x = 1
		zoom.y = 1
