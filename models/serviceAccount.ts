export interface IServiceAccountCreate {
    name: string
    description: string
    permissions: string[]
}
export interface IServiceAccount {
    id: string,
    name: string,
    description: string,
    permissions: string []

}