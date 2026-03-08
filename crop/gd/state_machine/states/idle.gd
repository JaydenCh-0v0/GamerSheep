extends NodeState

# State for idle
@export var player: Player
@export var animated_sprite_2d: AnimatedSprite2D
@export var hit_component: HitComponent

func _on_process(_delta : float) -> void:
	pass


func _on_physics_process(delta: float) -> void:
	player.moving_direction = GameInputEvents.movement_input(player.get_global_mouse_position(), player.position)[1]

	match (player.current_tool):
		DataTypes.Tools.AXE:
			animated_sprite_2d.play("idle_axe")
		DataTypes.Tools.HOE:
			animated_sprite_2d.play("idle_hoe")
		DataTypes.Tools.WATER:
			animated_sprite_2d.play("idle_water")
		DataTypes.Tools.PICKABLE_ITEM:
			animated_sprite_2d.play("idle_pick")
		_:
			animated_sprite_2d.play("idle")
	match(player.facing_direction):
		Vector2.LEFT:
			animated_sprite_2d.flip_h = true
		Vector2.RIGHT:
			animated_sprite_2d.flip_h = false
		_:
			animated_sprite_2d.flip_h = false

func _on_next_transitions() -> void:
	GameInputEvents.movement_input(player.get_global_mouse_position(), player.position)
	if ! GameInputEvents.is_reached_target(player.position):
		transition.emit("walking")
	
	if GameInputEvents.use_tool():
		match (player.current_tool):
			DataTypes.Tools.AXE:
				transition.emit("chopping")
			DataTypes.Tools.HOE:
				transition.emit("tilling")
			DataTypes.Tools.WATER:
				transition.emit("watering")
			DataTypes.Tools.SEED:
				transition.emit("planting")
			_:
				pass
	
	# 检查拾取输入和动物拾取
	if GameInputEvents.pick_input():		
		# 如果没有动物被点击，仍然可以进入拾取状态
		transition.emit("picking")

func _on_enter() -> void:
	GameInputEvents.target_position = player.position
	pass


func _on_exit() -> void:
	pass
