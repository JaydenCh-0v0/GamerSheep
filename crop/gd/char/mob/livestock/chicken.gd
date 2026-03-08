extends MobileObject

@onready var collision_shape_2d: CollisionShape2D = $CollisionShape2D


func _ready() -> void:
	super._ready()
	pass

func _physics_process(delta: float) -> void:
	collision_shape_2d.disabled = !self.able_to_act
