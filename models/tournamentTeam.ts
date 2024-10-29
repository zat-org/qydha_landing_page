export interface ITeamCreate {
    name: string,
    // json
    additionalData:
    {
        additionalProp1: string,
        additionalProp2: string,
        additionalProp3: string
    },
    players:
    {
        name: string,
        phone: string,
        email: string,
        additionalData: {
            additionalProp1: string,
            additionalProp2: string,
            additionalProp3: string
        },
        qydhaUsername: string
    }[]

}