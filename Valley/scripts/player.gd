extends CharacterBody2D

@onready var item : Node2D = get_node("Item")
@onready var item_ani : AnimationPlayer = item.get_node("ItemAnimationPlayer")

const SPEED = 80.0
const JUMP_VELOCITY = -400.0
var current_dir = "front"

# Get the gravity from the project settings to be synced with RigidBody nodes.
var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")

func _ready():
	play_ani("idle")

func _process(delta):
	var mouse_dir : Vector2 = (get_global_mouse_position() - global_position).normalized()
	item.rotation = mouse_dir.angle()
	if (item.scale.y == 1 and mouse_dir.x < 0):
		item.scale.y = -1
	elif item.scale.y == -1 and mouse_dir.x > 0:
		item.scale.y = 1
	if (Input.is_action_just_pressed("click") and not item_ani.is_playing()):
		item_ani.play("axe")

func _physics_process(delta):
	handle_player_movement(delta)
	
func handle_player_movement(delta):
	var dir_x:int = 0
	var dir_y:int = 0
	if Input.is_action_pressed("ui_left"):
		dir_x = -1
	elif Input.is_action_pressed("ui_right"):
		dir_x = +1
	if Input.is_action_pressed("ui_up"):
		dir_y = -1
	elif Input.is_action_pressed("ui_down"):
		dir_y = +1
	update_dir(dir_x,dir_y)
	
	var real_speed = SPEED 
	if (dir_x != 0 && dir_y != 0):
		real_speed *= 0.71 # ratio of 1/squrt 2 = 0.7071 --> 0.71*100
	velocity.x = dir_x * real_speed
	velocity.y = dir_y * real_speed
	
	if (dir_x == 0 && dir_y == 0):
		play_ani("idle")
	else:
		play_ani("walk")
	move_and_slide()

func update_dir(dir_x:int,dir_y:int):
	match(dir_x * 10 + dir_y):
		-11: current_dir = "left_back"
		-10: current_dir = "left_side"
		-9:  current_dir = "left_front"
		-1:  current_dir = "back"
		+1:  current_dir = "front"
		+9:  current_dir = "right_back"
		+10: current_dir = "right_side"
		+11: current_dir = "right_front"
		_:   return

func play_ani(action):
	var dir = current_dir
	var ani: AnimatedSprite2D = $AnimatedSprite2D
	match(action):
		"walk": ani.play(dir+"_"+action)
		"idle": ani.play(dir+"_"+action)
		_: return
