import { Area } from "./sdk/area";
import { RoundContext } from "./sdk/round-context";
import { MoveCollection } from "./sdk/move-collection";
import { BotBase } from "./sdk/bot-base";

export class PlayerBot extends BotBase {
    private attack1 = Area.HookKick;
    private attack2 = Area.HookPunch;
    private defence = Area.HookKick;

    private changeDefence(oldDefence: Area): Area
    {
        return (oldDefence == Area.HookKick) ? Area.HookPunch : Area.HookKick;
    }

    private createRandomAttack(): Area
    {
        return Math.random() > 0.5 ? Area.LowKick : Area.HookPunch;
    }

    public nextMove(context: RoundContext): MoveCollection
    {
        const myLifePoints = context.getMyLifePoints();
        const opponentLifePoints = context.getOpponentLifePoints();
        
        context.getMyMoves()
                .addAttack(this.attack1)
                .addAttack(this.attack2);

        if ((context.getLastOpponentMoves() != null) && context.getLastOpponentMoves().getAttacks().filter(x => x.getArea() == this.defence).length === 0)
        {
            this.defence = this.changeDefence(this.defence);
        }

        if (myLifePoints >= opponentLifePoints)
            context.getMyMoves().addAttack(this.createRandomAttack()); // 3 attacks, 0 defence
        else
            context.getMyMoves().addDefence(this.defence);

        return context.getMyMoves();
    }

    public toString(): String
    {
        return "PlayerBot";
    }
}