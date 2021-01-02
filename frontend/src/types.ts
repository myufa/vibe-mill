export interface User {
    id?: string;
    username?: string;
    displayName?: string;
    profileUrl?: string | null;
    profilePic?: string;
    country?: string;
    followers?: number | null;
    product?: string | null;
    emails?: [{ value: string; type: null }];
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