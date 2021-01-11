let accountData = {};

class AccountTransactionModel {

    static data = {};
    static reset () { accountData = {}; }

    constructor (account_id) {
        this.account_id = account_id;
    }


    deposit (amount) {
        if (accountData[this.account_id])
            accountData[this.account_id] += amount;
        else
            accountData[this.account_id] = amount;
        return this;
    }

    balance () {
        return {
            "id": this.account_id,
            "balance": accountData[this.account_id]
        };
    }


}

module.exports = AccountTransactionModel;
