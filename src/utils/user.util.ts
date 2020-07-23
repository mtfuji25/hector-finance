import moment from "moment";

import { UserSubscription } from "../models";

export interface ICredit {
    universe_max: number;
    device_max: number;
}

export async function getCredit(user: any): Promise<ICredit> {
    // At least one device must be active, so user can purchase a plan
    const credit: ICredit = { universe_max: 0, device_max: 1 };

    // Find an an active subscriptions
    const subscriptions = (await UserSubscription.find({
        user_id: user.id,
        expiry_date: { $gte: moment.utc().toDate() },
        approved: true,
    })
        .populate("plan_id")
        .sort({
            expiry_date: "desc",
        })) as any[];

    // Pickup the greatest credit values from all active plans
    subscriptions.forEach(subscription => {
        const plan = subscription.plan_id;
        if (plan.approved) {
            if (plan.universe_max > credit.universe_max) {
                credit.universe_max = plan.universe_max;
            }
            if (plan.device_max > credit.device_max) {
                credit.device_max = plan.device_max;
            }
        }
    });

    return credit;
}
