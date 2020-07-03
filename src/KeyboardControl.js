export function bindKeyboardConfig (stage, Phaser, target, cursors) {


    target.setVelocity(0);

    if (cursors.left.isDown)
    {
        target.setVelocityX(-300);
    }
    else if (cursors.right.isDown)
    {
        target.setVelocityX(300);
    }

    if (cursors.up.isDown)
    {
        target.setVelocityY(-300);
    }
    else if (cursors.down.isDown)
    {
        target.setVelocityY(300);
    }

};