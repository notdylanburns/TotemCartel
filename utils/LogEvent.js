export class BaseEvent {
    constructor(type, success) {
        const createTime = new Date();
        
        this.event_type = type;
        this.success = success;
        this.time = createTime.toString();
        this.epoch = createTime.getTime();
    }

    get() {
        return {
            event_type: this.event_type,
            user: this.user,
            linked: this.linked,
            success: this.success,
            time: this.time,
            epoch: this.epoch, 
        }
    }

}

export class UserEvent extends BaseEvent {
    constructor (type, user, linked, success) {
        super(type, success);
        this.user = user;
        this.linked = linked;
    }

    get() {
        return {
            ...super.get(),
            user: this.user,
            linked: this.linked,
        }
    }
}

export class RequestEvent extends UserEvent {
    constructor (user, linked, num_requested, old_total, new_total) {
        super("request", user, linked, linked);
        this.count = num_requested;
        this.old_total = old_total;
        this.new_total = new_total;
    }

    get() {
        return {
            ...super.get(),
            count: this.count,
            old_total: this.old_total,
            new_total: this.new_total,
        }
    }
};

export class LinkEvent extends UserEvent {
    constructor (user, linked, old_account, new_account) {
        super("link", user, linked, true);
        this.old_account = old_account;
        this.new_account = new_account;
    }

    get() {
        return {
            ...super.get(),
            old_account: this.old_account,
            new_account: this.new_account,
        }
    }
};

export class GrantEvent extends BaseEvent {
    constructor (user, success, granter, num_requested, debt_incurred, prev_debt) {
        super("grant", success);
        this.granter = granter;
        this.grantee = user;
        this.num_granted = num_requested;
        this.debt_incurred = debt_incurred;
        this.prev_debt = prev_debt;
    }

    getGranter() {
        return {
            ...super.get(),
            role: "granter",
            grantee: this.grantee,
            num_granted: this.num_granted,
            old_debt: this.prev_debt,
            new_debt: this.prev_debt + this.debt_incurred,
            debt_incurred: this.debt_incurred,
        }
    }

    getGrantee() {
        return {
            ...super.get(),
            role: "grantee",
            granter: this.granter,
            num_granted: this.num_granted,
            old_debt: this.prev_debt,
            new_debt: this.prev_debt + this.debt_incurred,
            debt_incurred: this.debt_incurred,
        }
    }
};

export class DenyEvent extends BaseEvent {
    constructor (user, success, granter, num_requested) {
        super("deny", success);
        this.granter = granter;
        this.grantee = user;
        this.num_granted = num_requested;
    }

    getGranter() {
        return {
            ...super.get(),
            role: "granter",
            grantee: this.grantee,
            num_denied: this.num_granted,
        }
    }

    getGrantee() {
        return {
            ...super.get(),
            role: "grantee",
            granter: this.granter,
            num_denied: this.num_granted,
        }
    }
};

export class ClaimEvent extends BaseEvent {
    constructor (user, success, claimer, num_claimed, old_debt) {
        super("claim", success);
        this.claimer = claimer;
        this.claimee = user;
        this.num_claimed = num_claimed;
        this.old_debt = old_debt;
    }

    getClaimer() {
        return {
            ...super.get(),
            role: "claimer",
            claimee: this.claimee,
            num_claimed: this.num_claimed,
            old_debt: this.old_debt,
        }
    }

    getClaimee() {
        return {
            ...super.get(),
            role: "claimee",
            claimer: this.claimee,
            num_claimed: this.num_claimed,
            old_debt: this.old_debt,
        }
    }
};