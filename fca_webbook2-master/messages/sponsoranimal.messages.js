module.exports = {
    success: {
        s0: {
            code: "SponsorAnimalCreated",
            http: 201,
            type: "success"
        },
        s1: {
            http: 200,
            code: "SponsorAnimalUpdated",
            type: "success"
        },
        s2: {
            http: 200,
            code: "SponsorAnimalFound",
            type: "success"
        },
        s3: {
            http: 200,
            code: "SponsorAnimalDeleted",
            type: "success"
        },
        s4: {
            http: 200,
            code: "Deactivated",
            type: "success"
        },
        s5: {
            http: 204,
            code: "NoSponsorAnimals",
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
            code: "SponsorAnimalNotFound",
            type: "error"
        }
    }
}