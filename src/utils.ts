export function isEqualArray<T>(array1: T[], array2: T[]):boolean {
    return JSON.stringify(array1) === JSON.stringify(array2)
}

export function isEqualObject<T>(array1: T, array2: T):boolean {
    return JSON.stringify(array1) === JSON.stringify(array2)
}