module.exports = {
    success: {
        s0: {
            code: "ExpertAnimalCreated",
            http: 201,
            type: "success"
        },
        s1: {
            http: 200,
            code: "ExpertAnimalUpdated",
            type: "success"
        },
        s2: {
            http: 200,
            code: "ExpertAnimalFound",
            type: "success"
        },
        s3: {
            http: 200,
            code: "ExpertAnimalDeleted",
            type: "success"
        },
        s4: {
            http: 200,
            code: "Deactivated",
            type: "success"
        },
        s5: {
            http: 204,
            code: "NoExpertAnimals",
            type: "success"
        },
        s6: {
            http: 200,
            code: "Activated",
            type: "success"
        }
    },
    error: {
        e0: {
            http: 404,
            code: "ExpertAnimalNotFound",
            type: "error"
        }
    }
}