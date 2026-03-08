class_name MobileObject
extends CharacterBody2D

@export var speed_range: Vector2 = Vector2(5.0, 15.0) # x:min_speed, y:max_speed
@export var walk_cycle_range: Vector2i = Vector2(1, 2) # x:min_cycle, y:max_cycle
@export var age: DataTypes.MobAge = DataTypes.MobAge.BABY
@export var age_growth_timer: Timer = Timer.new()
@export var able_to_act: bool = true #當MOB進入玩家交互範圍或位於拾起堆上時，則可交互
@export var able_to_pick: bool = true #當MOB進入玩家交互範圍時，則可被拾起及進入拾起堆

func get_age()->String:
	match age:
		DataTypes.MobAge.BABY:
			return "Baby"
		DataTypes.MobAge.ADULT:
			return "Adult"
		_:
			return "None"

func get_speed() -> float: return randf_range(speed_range.x, speed_range.y)

func get_walk_cycle() -> int: return randi_range(walk_cycle_range.x, walk_cycle_range.y)

func _ready():
	age_growth_timer.wait_time = randf() * 30
	age_growth_timer.timeout.connect(_on_age_growth_timer_timeout.bind(), CONNECT_DEFERRED)
	add_child(age_growth_timer)
	age_growth_timer.start()

func _on_age_growth_timer_timeout():
	if age == DataTypes.MobAge.BABY:
		age = DataTypes.MobAge.ADULT
		age_growth_timer.stop()
