export interface User {
    displayName?: string
    images?: Image[]
    photos?: string[]
    product?: string
    type?: string
    id?: string
    href?: string
    followers?: Followers
}

export interface Image {
    height: string
    width: string
    url: string
}

export interface Followers {
    href: string
    total: string
}