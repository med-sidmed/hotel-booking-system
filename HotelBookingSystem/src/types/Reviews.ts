export interface Review {
    id: number | string;
    userId: number | string;
    hotelId: number | string | undefined;
    rating: number;
    comment: string;
    createdAt: string | Date;
}