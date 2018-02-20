declare const process;
export class Platform {
    public static isNode() {
        return typeof module !== 'undefined' && module['exports'] &&
            typeof process !== "undefined" && typeof window === "undefined";
    }

}