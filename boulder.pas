procedure ScanStationaryBoulder(in positionType boulderPosition) 
# Local variables
    positionType NewPosition;
    objectType theObjectBelow;

# If the boulder can fall, move it down and mark it as falling.
    NewPosition := GetRelativePosition(boulderPosition, down1);
    theObjectBelow := GetObjectAtPosition(NewPosition);
    if (theObjectBelow == objSpace) then
        PlaceObject(objBoulder, attribFalling, NewPosition);
        PlaceObject(objSpace, attribNone, boulderPosition);
        RequestSound(boulderSound); # yes, even when it starts falling. This applies to diamonds too (requests diamondSound).
    else

# Failing that, see if the boulder can roll
        if (CanRollOff(theObjectBelow)) then

# Try rolling left
            NewPosition := GetRelativePosition(boulderPosition, left1);
            if ((GetObjectAtPosition(NewPosition) == objSpace) and (GetObjectAtPosition(GetRelativePosition(boulderPosition, down1left)) == objSpace)) then
                PlaceObject(objBoulder, attribFalling, NewPosition);
                PlaceObject(objSpace, attribNone, boulderPosition);
            else

# Try rolling right
                NewPosition := GetRelativePosition(boulderPosition, right1);
                if ((GetObjectAtPosition(NewPosition) == objSpace) and (GetObjectAtPosition(GetRelativePosition(boulderPosition, down1right)) == objSpace)) then
                    PlaceObject(objBoulder, attribFalling, NewPosition);
                    PlaceObject(objSpace, attribNone, boulderPosition);
                endif
            endif
        endif
    endif 
endprocedure

##

procedure ScanFallingBoulder(in positionType boulderPosition;
                             in/out magicWallStatusType magicWallStatus) 
# Local variables
    positionType NewPosition;
    objectType theObjectBelow;

# If the boulder can continue to fall, move it down.
    NewPosition := GetRelativePosition(boulderPosition, down1);
    theObjectBelow := GetObjectAtPosition(NewPosition);
    if (theObjectBelow == objSpace) then
        PlaceObject(objBoulder, attribFalling, NewPosition);
        PlaceObject(objSpace, attribNone, boulderPosition);    # ie old position

# If the object below is a magic wall, we activate it (if it's off), and 
# morph into a diamond two spaces below if it's now active. If the wall 
# is expired, we just disappear (with a sound still though).
    elsif (theObjectBelow == objMagicWall) then
            if (magicWallStatus == kMagicWallOff) then
                magicWallStatus := kMagicWallOn);
            endif
            if (magicWallStatus == kMagicWallOn) then
                NewPosition := GetRelativePosition(boulderPositon, down2);
                if (GetObjectAtPosition(NewPosition) == objSpace) then
                    PlaceObject(objDiamond, attribFalling, NewPosition);
                endif
            endif
            PlaceObject(objSpace, attribNone, boulderPosition);
            RequestSound(diamondSound); # note: Diamond sound
        endif

# Failing that, we've hit something, so we play a sound and see if we can roll.
    else
        RequestSound(boulderSound);
        if (CanRollOff(theObjectBelow)) then

# Try rolling left
            NewPosition := GetRelativePosition(boulderPosition, left1);
            if ((GetObjectAtPosition(NewPosition) == objSpace) and (GetObjectAtPosition(GetRelativePosition(boulderPosition, down1left)) == objSpace)) then
                PlaceObject(objBoulder, attribFalling, NewPosition);
                PlaceObject(objSpace, attribNone, boulderPosition);
            else

# Try rolling right
                NewPosition := GetRelativePosition(boulderPosition, right1);
                if ((GetObjectAtPosition(NewPosition) == objSpace) and (GetObjectAtPosition(GetRelativePosition(boulderPosition, down1right)) == objSpace)) then
                    PlaceObject(objBoulder, attribFalling, NewPosition);
                    PlaceObject(objSpace, attribNone, boulderPosition);

# The boulder is sitting on an object which it could roll off, but it can't 
# roll, so it comes to a stop.
                else            
                    PlaceObject(objBoulder, attribStationary, boulderPosition);
                endif
            endif

# Failing all that, we see whether we've hit something explosive
        elsif (ImpactExplosive(theObjectBelow) then
            Explode(NewPosition, GetExplosionType(theObjectBelow));

# And lastly, failing everything, the boulder comes to a stop.
        else
            PlaceObject(objBoulder, attribStationary, boulderPosition);
        endif
    endif 
endprocedure

##

function CanRollOff(in objectType anObjectBelow):Boolean 
# If the specified object is one which a boulder or diamond can roll off, 
# return true otherwise return false.

# First of all, only objects which have the property of being "rounded" are
# are ones which things can roll off. Secondly, if the object is a boulder
# or diamond, the boulder or diamond must be stationary, not falling.

# We're going to assume that GetObjectProperty() automatically returns "true"
# for objBoulderStationary, objDiamondStationary, objBrickWall, and returns "false"
# for everything else (including objBoulderFalling and objDiamondFalling).

    return (GetObjectProperty(anObjectBelow, propertyRounded));
endfunction

##

function ImpactExplosive(in objectType anObject):Boolean 
# If the specified object has the property of being something that can
# explode, return true otherwise return false.
# ImpactExplosive objects are: Rockford, Firefly, Butterfly.
    return (GetObjectProperty(anObject, propertyImpactExplosive)); # true/false
endfunction

##

function GetExplosionType(in objectType anObject):explosionType;
# Assuming that the specified object is in fact explosive, returns the type
# of explosion (explodeToSpace or explodeToDiamonds)
# Explosive objects are: Rockford, Firefly, Butterfly.

    ASSERT (Explosive(anObjectBelow));
    
    return (GetObjectProperty(anObject, propertyExplosionType));
endfunction

##