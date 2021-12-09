procedure ScanRockford(in positionType currentScanPosition;
                       inout positionType RockfordLocation;
                       inout Boolean RockfordAnimationFacingDirection;
                       in Boolean demoMode;
                       in Boolean twoJoystickMode;
                       in playerType currentPlayer;
                       inout integer numRoundsSinceRockfordSeenAlive)
# We have come across Rockford during the scan routine. Read the joystick or
# demo data to find out where Rockford wants to go, and call a subroutine to
# actually do it.

    ASSERT(numRoundsSinceRockfordSeenAlive >= 0);

# Local variables
    joystickDirectionRecord JoyPos;

# If we're in demo mode, we get our joystick movements from the demo data
    if (demoMode) then
        JoyPos := GetNextDemoMovement();
    else

# Otherwise if we're in a real game, we get our joystick movements from
# the current player's input device (joystick, keyboard, whatever).
        JoyPos := GetJoystickPos();
    endif

# Call a subroutine to actually deal with the joystick movement.
    MoveRockfordStage1(currentScanPosition, RockfordLocation, JoyPos, RockfordAnimationFacingDirection);

# Rockford has been seen alive, so reset the counter indicating the number
# of rounds since Rockford was last seen alive.
    numRoundsSinceRockfordSeenAlive := 0;
endprocedure ScanRockford

##

procedure MoveRockfordStage1(in positionType currentScanPosition;
                             inout positionType RockfordLocation;
                             in joystickDirectionRecord JoyPos;
                             inout Boolean RockfordAnimationFacingDirection)
# Note: in this routine, if the user presses diagonally, the horizontal movement takes
# precedence over the vertical movement; ie Rockford moves horizontally.

# Local variables
    Boolean ActuallyMoved;
    positionType NewPosition;

# Determine Rockford's new location if he actually moves there (ie he isn't
# blocked by a wall or something, and isn't holding the fire button down).
    switch (JoyPos.direction) of
        case down:
            RockfordMoving := true;
            NewPosition := GetRelativePosition(currentScanPosition, down1);
        elscase up:
            RockfordMoving := true;
            NewPosition := GetRelativePosition(currentScanPosition, up1);
        elscase right:
            RockfordMoving := true;
            RockfordAnimationFacingDirection := facingRight;
            NewPosition := GetRelativePosition(currentScanPosition, right1);
        elscase left:
            RockfordMoving := true;
            RockfordAnimationFacingDirection := facingLeft;
            NewPosition := GetRelativePosition(currentScanPosition, left1);
        else
            RockfordMoving := false;
        endcase

# Call a subroutine to actually deal with this further.
        ActuallyMoved := MoveRockfordStage2(currentScanPosition, NewPosition, JoyPos);

# If Rockford did in fact physically move, we update our record of Rockford's
# position (used by the screen scrolling algorithm to know where to scroll).
        if (ActuallyMoved) then
            RockfordLocation := NewPosition;
        endif
    endswitch
endprocedure MoveRockfordStage1

##

function MoveRockfordStage2(in positionType originalPosition;
                            in positionType newPosition;
                            in joystickDirectionRecord JoyPos):Boolean
# Part of the Move Rockford routine. Call MoveRockfordStage3 to do all the work.
# All this routine does is check to see if the fire button was down, and
# so either move Rockford to his new position or put a space where he would
# have moved. Returns true if Rockford really did physically move.

# Local variables
    Boolean ActuallyMoved;

# Call a subroutine to move Rockford. It returns true if the movement was
# successful (without regard to the fire button).
    ActuallyMoved := MoveRockfordStage3(newPosition, JoyPos);

# If the movement was successful, we check the fire button to determine
# whether Rockford actually physically moves to the new positon or not.
    if (ActuallyMoved) then
        if (JoyPos.fireButtonDown) then
            PlaceSpace(newPosition);
            ActuallyMoved := false;
        else
            PlaceRockford(newPosition);
            PlaceSpace(originalPosition);
        endif
    endif

# Tell our caller whether or not Rockford physically moved to a new position.
    return ActuallyMoved;
endfunction MoveRockfordStage2

##

function MoveRockfordStage3(in positionType newPosition;
                            in joystickDirectionRecord JoyPos):Boolean
# See what object is in the space where Rockford is moving and deal with it
# appropriately. Returns true if the movement was successful, false otherwise.

# Local Variables
    Boolean movementSuccessful;
    objectType theObject;
    positionType NewBoulderPosition;

# Determine what object is in the place where Rockford is moving.
    movementSuccessful := false;
    theObject := GetObjectAtPosition(newPosition);
    switch (theObject) of

# Space: move there, and play a sound (lower pitch white noise)
        case objSpace:
            movementSuccessful := true;
            RequestRockfordMovementSound(movingThroughSpace);

# Dirt: move there, and play a sound (higher pitch white noise)
        elscase objDirt:
            movementSuccessful := true;
            RequestRockfordMovementSound(movingThroughDirt);

# Diamond: pick it up
        elscase objStationaryDiamond:
            movementSuccessful := true;
            PickUpDiamond();

# OutBox: flag that we've got out of the cave
        elscase objOutBox:
            movementSuccessful := true;
            FlagThatWeAreExitingTheCave(and that we got out alive);

# Boulder: push it
        elscase objStationaryBoulder:
            if (JoyPos.direction == left) then
                NewBoulderPosition := GetRelativePosition(newPosition, left1);
                if (GetObjectAtPosition(NewBoulderPosition) == objSpace) then
                    movementSuccessful := PushBoulder(NewBoulderPosition);
                endif
            elsif (JoyPos.direction == right) then
                NewBoulderPosition := GetRelativePosition(newPosition, right1);
                if (GetObjectAtPosition(NewBoulderPosition) == objSpace) then
                    movementSuccessful := PushBoulder(NewBoulderPosition);
                endif
            endif
        endcase
    endswitch

# Return an indication of whether we were successful in moving.
    return movementSuccessful;
endfunction MoveRockfordStage3

##

function PushBoulder(in positionType newBoulderPosition)
# There is a 12.5% (1 in 8) than Rockford will succeed in pushing the boulder.
# Return true if boulder successfully pushed, false if not.

# Local variables
    Boolean pushSuccessful;

    pushSuccessful := (GetRandomNumber(0, 7) == 0);
    if (pushSuccessful) then
        RequestSound(boulderSound);
        PlaceBoulder(newBoulderPosition);
    endif

    return pushSuccessful;
endfunction PushBoulder

##

procedure PickUpDiamond()
# Player has picked up a diamond. Increase their score, increase their number
# of diamonds collected, and check whether they have enough diamonds now.

    RequestSound(pickedUpDiamondSound);
    CurrentPlayerData.score += CurrentPlayerData.currentDiamondValue;
    CheckForBonusLife();
    CurrentPlayerData.diamondsCollected++;
    CheckEnoughDiamonds();
endprocedure PickUpDiamond

##

procedure CheckEnoughDiamonds()
    if (CurrentPlayerData.diamondsCollected == CaveData.diamondsNeeded) then
        CurrentPlayerData.gotEnoughDiamonds := true;
        CurrentPlayerData.currentDiamondValue := CaveData.extraDiamondValue;
        Update statusbar;
        RequestSound(crackSound);
        Request screen to flash white to indicate got enough diamonds;
    endif
endprocedure CheckEnoughDiamonds

##

procedure AnimateRockford(inout Boolean Tapping;
                          inout Boolean Blinking;
                          in Boolean RockfordAnimationFacingDirection)
# Called by the animation routine every animation frame

# If Rockford is currently moving, we display the right-moving or left-moving animation
# sequence.
    if (RockfordMoving)

# Can't tap or blink while moving
        Tapping := false;
        Blinking := false;

# Set up animation left or right as appropriate
        if (RockfordAnimationFacingDirection == facingRight)
            doing right-facing Rockford animation sequence
        else
            doing left-facing Rockford animation sequence
        endif

# If Rockford is not currently moving, we display a forward facing animation sequence.
# Rockford might be idle, tapping, blinking, or both.
    else

# If we're at the beginning of an animation sequence, then check whether we
# will blink or tap for this sequence
    if (AnimationStage == 1)

# 1 in 4 chance of blinking
        Blinking := (GetRandomNumber(0, 3) == 0);

# 1 in 16 chance of starting or stopping foot tapping
        if (GetRandomNumber(0, 15) == 0)
            Tapping := not Tapping;
        endif       
    endif

    doing forward-facing Rockford animation sequence (idle, blink, tap, or blink&tap)

endprocedure AnimateRockford