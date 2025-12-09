from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound

def save(db: Session, instance):

    model_class = instance.__class__
    primary_key_column = list(model_class.__table__.primary_key.columns)[0].name
    primary_key_value = getattr(instance, primary_key_column)

    existing = None
    if primary_key_value is not None:
        existing = db.query(model_class).get(primary_key_value)

    if existing:
        for attr, value in instance.__dict__.items():
            if attr != "_sa_instance_state":
                setattr(existing, attr, value)

        db.commit()
        db.refresh(existing)
        return existing

    else:
        db.add(instance)
        db.commit()
        db.refresh(instance)
        return instance
