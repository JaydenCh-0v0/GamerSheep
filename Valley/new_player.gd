extends CharacterBody2D

const MAX_SPEED = 100.0
enum DIR { FRONT, L_SIDE, R_SIDE, BACK }
enum ACT { IDLE, MOVE, DEAD }

var movement_input: Vector2 = Vector2.ZERO
var friction = 600
var accel = 1500

var mouse_xy : Vector2 = Vector2.ZERO
var keybd_xy : Vector2 = Vector2.ZERO

var face_dir : DIR = DIR.FRONT
var move_dir : DIR = DIR.FRONT
var char_act : ACT = ACT.IDLE

func _physics_process(delta):
	# update_face_dir()
	handle_char_act(delta)

#func update_face_dir():
	#var limit = .75
	#mouse_dir = (get_global_mouse_position() - global_position).normalized()
	#if abs(mouse_dir.x) > limit: #is in limit
		#if mouse_dir.x > 0:
			#face_dir = DIR.R_SIDE
		#else:
			#face_dir = DIR.L_SIDE
	#if abs(mouse_dir.y) > limit : # is in limit
		#if mouse_dir.y > 0:
			#face_dir = DIR.FRONT
		#else:
			#face_dir = DIR.BACK

func calculate_dir(dir : DIR, norm_xy : Vector2, limit : float = .75):
	if abs(norm_xy.x) > limit: #is in limit
		if norm_xy.x > 0:
			dir = DIR.R_SIDE
		else:
			dir = DIR.L_SIDE
	if abs(norm_xy.y) > limit : # is in limit
		if norm_xy.y > 0:
			dir = DIR.FRONT
		else:
			dir = DIR.BACK
	return dir

func check_backwalk():
	return face_dir==DIR.L_SIDE && move_dir==DIR.R_SIDE \
		or face_dir==DIR.R_SIDE && move_dir==DIR.L_SIDE ;

func is_inside_range(val : float, min_val : float, max_val : float) -> bool:
	return val >= (min_val - 0.000001) and val <= (max_val + 0.000001)

func handle_char_act(delta):
	get_movement_input()
	update_dir()
	handle_movement_animation()
	handle_movement_action(delta)

func get_movement_input():
	movement_input.x = int(Input.is_action_pressed("ui_right")) - int(Input.is_action_pressed("ui_left"))
	movement_input.y = int(Input.is_action_pressed("ui_down")) - int(Input.is_action_pressed("ui_up"))
	keybd_xy = movement_input.normalized()
	mouse_xy = (get_global_mouse_position() - global_position).normalized()
	
func update_dir():
	face_dir = calculate_dir(face_dir, mouse_xy)
	move_dir = calculate_dir(move_dir, keybd_xy)

func handle_movement_action(delta):
	var speed = MAX_SPEED
	if check_backwalk():
		speed *= 0.75
	if movement_input.is_zero_approx():
		if velocity.length() > (friction * delta):
			velocity -= velocity.normalized() * (friction * delta)
		else:
			velocity = Vector2.ZERO
			char_act = ACT.IDLE
	else:
		velocity += (movement_input * accel * delta)
		velocity = velocity.limit_length(speed) 
		char_act = ACT.MOVE
	move_and_slide()

func handle_movement_animation():
	var ani: AnimatedSprite2D = $AnimatedSprite2D
	ani.set_flip_h(face_dir == DIR.L_SIDE)
	if check_backwalk():
		ani.speed_scale = -1
	else:
		ani.speed_scale = 1
	match (char_act):
		ACT.IDLE:
			match (face_dir):
				DIR.FRONT:	ani.play("front_idle")
				DIR.BACK:	ani.play("back_idle")
				_:			ani.play("side_idle")
		ACT.MOVE:
			match (face_dir):
				DIR.FRONT:	ani.play("front_walk")
				DIR.BACK:	ani.play("back_walk")
				_:			ani.play("side_walk")
		ACT.DEAD:
				ani.play("death")
