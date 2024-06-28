extends CharacterBody2D

const MAX_SPEED = 100.0
enum DIR { FRONT, L_SIDE, R_SIDE, BACK }
enum ACT { IDLE, MOVE, DEAD }

var movement_input: Vector2 = Vector2.ZERO
var friction = 600
var accel = 1500

var mouse_dir : Vector2 = Vector2.ZERO
var char_dir : DIR = DIR.FRONT
var char_act : ACT = ACT.IDLE

func _physics_process(delta):
	update_char_dir()
	handle_char_act(delta)

func update_char_dir():
	var limit = .75
	mouse_dir = (get_global_mouse_position() - global_position).normalized()
	if abs(mouse_dir.x) > limit: #is in limit
		if mouse_dir.x > 0:
			char_dir = DIR.R_SIDE
		else:
			char_dir = DIR.L_SIDE
	if abs(mouse_dir.y) > limit : # is in limit
		if mouse_dir.y > 0:
			char_dir = DIR.FRONT
		else:
			char_dir = DIR.BACK

func is_inside_range(val : float, min_val : float, max_val : float) -> bool:
	return val >= (min_val - 0.000001) and val <= (max_val + 0.000001)

func handle_char_act(delta):
	get_movement_input()
	handle_movement_animation()
	handle_movement_action(delta)

func get_movement_input():
	movement_input.x = int(Input.is_action_pressed("ui_right")) - int(Input.is_action_pressed("ui_left"))
	movement_input.y = int(Input.is_action_pressed("ui_down")) - int(Input.is_action_pressed("ui_up"))
	movement_input.normalized()
	
func handle_movement_action(delta):
	if movement_input.is_zero_approx():
		if velocity.length() > (friction * delta):
			velocity -= velocity.normalized() * (friction * delta)
		else:
			velocity = Vector2.ZERO
			char_act = ACT.IDLE
	else:
		velocity += (movement_input * accel * delta)
		velocity = velocity.limit_length(MAX_SPEED) 
		char_act = ACT.MOVE
	move_and_slide()

func handle_movement_animation():
	var ani: AnimatedSprite2D = $AnimatedSprite2D
	ani.set_flip_h(char_dir == DIR.L_SIDE)
	match (char_act):
		ACT.IDLE:
			match (char_dir):
				DIR.FRONT:	ani.play("front_idle")
				DIR.BACK:	ani.play("back_idle")
				_:			ani.play("side_idle")
		ACT.MOVE:
			match (char_dir):
				DIR.FRONT:	ani.play("front_walk")
				DIR.BACK:	ani.play("back_walk")
				_:			ani.play("side_walk")
		ACT.DEAD:
				ani.play("death")
