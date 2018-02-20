import {Dancer} from "./entities/DanceEvent";

export class DancerRepository {
    private static instance: DancerRepository = null;

    private constructor() {
    }

    public static get Instance(): DancerRepository {
        if (this.instance == null) {
            this.instance = new DancerRepository();
        }
        return this.instance;
    }

    private dancers: Dancer[] = [];

    public createOrGet(name: string) {
        for (let i = 0; i < this.dancers.length; i++) {
            if (this.dancers[i].name == name) {
                return this.dancers[i];
            }
        }
        this.dancers.push(new Dancer(name));
        return this.dancers[this.dancers.length - 1];
    }
}
