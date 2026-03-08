extends NodeState

# State for chopping trees
@export var player: Player
@export var animated_sprite_2d: AnimatedSprite2D
@export var hit_component: HitComponent
@export var hit_component_collision_shape: CollisionShape2D
@export var picking_stack: Array[MobileObject]

# 存储当前被拾取的动物
var current_picked_animal: MobileObject = null

func _ready() -> void:
	hit_component_collision_shape.disabled = true
	hit_component_collision_shape.position = Vector2.ZERO
	hit_component.pickable_activated.connect(on_pickable_activated)

func on_pickable_activated(area: Area2D) -> void:
	# 当动物进入攻击区域时，只记录动物，不立即拾取
	# 实际的拾取逻辑在动画完成后执行
	current_picked_animal = area.get_parent()
	print("检测到可拾取动物: ", current_picked_animal.name)

func _on_process(_delta : float) -> void:
	pass


func _on_physics_process(_delta : float) -> void:
	animated_sprite_2d.play("picking")
	match(player.facing_direction):
		Vector2.LEFT:
			animated_sprite_2d.flip_h = true
			hit_component_collision_shape.position = Vector2(-12,-3)
		Vector2.RIGHT:
			animated_sprite_2d.flip_h = false
			hit_component_collision_shape.position = Vector2(+12,-1)
		_:
			animated_sprite_2d.flip_h = false
			hit_component_collision_shape.position = Vector2(+12,-1)
	if animated_sprite_2d.frame >= 1:
		hit_component_collision_shape.disabled = false


func _on_next_transitions() -> void:
	await animated_sprite_2d.animation_finished
	
	# 如果成功拾取了动物，将其放置在玩家的hand_hold节点下
	if current_picked_animal != null:
		print("成功拾取: ", current_picked_animal.name)
		
		# 获取玩家的hand_hold节点
		player.current_tool = DataTypes.Tools.PICKABLE_ITEM
		var hand_hold = player.get_node("HandHold")
		
		# 将动物从原位置移除并添加到hand_hold节点下
		if current_picked_animal.get_parent() != null:
			current_picked_animal.get_parent().remove_child(current_picked_animal)
			picking_stack.append(current_picked_animal)
		
		
		hand_hold.add_child(current_picked_animal)
		current_picked_animal.position = Vector2.ZERO  # 重置位置到hand_hold中心
		
		# 可以在这里添加其他拾取后的逻辑，比如禁用动物的移动等
		# 例如：禁用动物的碰撞检测、移动等
		current_picked_animal.able_to_act = false
	
	print("transition to idle")
	transition.emit("idle")


func _on_enter() -> void:
	pass


func _on_exit() -> void:
	hit_component_collision_shape.disabled = true
	hit_component_collision_shape.position = Vector2.ZERO
	current_picked_animal = null
	pass
