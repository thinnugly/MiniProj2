<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Editar Animal Patrocinado" />

      <!--FORM-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="8">
          <form @submit.prevent="update">
            <div class="form-group">
              <label for="animal_id" class="custom-label">ANIMAL</label>
              <select
                id="animal_id"
                v-model="sponsorAnimal.animal_id"
                class="form-control form-control-lg"
                required
              >
                <option
                  v-for="animal in animals"
                  :key="animal._id"
                  :value="animal._id"
                >
                  {{ animal.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="sponsor_id" class="custom-label">PATROCINADOR</label>
              <select
                id="sponsor_id"
                v-model="sponsorAnimal.sponsor_id"
                class="form-control form-control-lg"
                required
              >
                <option
                  v-for="sponsor in sponsors"
                  :key="sponsor._id"
                  :value="sponsor._id"
                >
                  {{ sponsor.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="notes" class="custom-label">OBSERVAÇÕES</label>
              <textarea
                v-model="sponsorAnimal.notes"
                class="form-control form-control-lg"
                id="notes"
                placeholder="Escreva observações"
                cols="30"
                rows="5"
              ></textarea>
            </div>
            <button
              type="submit"
              class="btn btn-outline-success btn-lg mr-2"
              :disabled="hasErrors"
            >
              <i class="fas fa-edit"></i> ATUALIZAR
            </button>
            <router-link
              :to="{ name: 'sponsorAnimaisAssociados' }"
              tag="button"
              class="btn btn-outline-danger btn-lg"
            >
              <i class="fas fa-window-close"></i> CANCELAR
            </router-link>
          </form>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { EDIT_SPONSOR_ANIMAL } from '@/store/sponsors_animals/sponsorAnimals.constants';
import { FETCH_ANIMALS } from '@/store/animals/animal.constants';
import { FETCH_SPONSORS } from '@/store/sponsors/sponsor.constants';
import HeaderPage from '@/components/HeaderPage.vue';
import router from '@/router';
import { mapGetters } from 'vuex';

export default {
  name: 'EditSponsor',
  components: {
    HeaderPage,
  },
  data: () => {
    return {
      animals: [],
      sponsors: [],
      sponsorAnimal: {
        sponsor_id: '',
        animal_id: '',
        notes: '',
      },
      errors: {
        sponsor_id: '',
        animal_id: '',
      },
    };
  },
  computed: {
    ...mapGetters('sponsorAnimals', ['getSponsorAnimalById', 'getMessage']),
    ...mapGetters('animal', ['getAnimals']),
    ...mapGetters('sponsor', ['getSponsors']),
    hasErrors() {
      return Object.values(this.errors).some((error) => error !== '');
    },
  },
  methods: {
    fetchAnimals() {
      return this.$store.dispatch(`animal/${FETCH_ANIMALS}`).then(() => {
        this.animals = this.getAnimals;
      });
    },
    fetchSponsors() {
      return this.$store.dispatch(`sponsor/${FETCH_SPONSORS}`).then(() => {
        this.sponsors = this.getSponsors;
      });
    },
    validateText(field) {
      const value = this.sponsor[field];
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        this.errors[field] = 'Este campo deve conter apenas letras.';
      } else {
        this.errors[field] = '';
      }
    },
    validateNumber(field) {
      const value = this.sponsor[field];
      if (!/^\d*$/.test(value)) {
        this.errors[field] = 'Este campo deve conter apenas números.';
      } else {
        this.errors[field] = '';
      }
    },
    update() {
      if (this.hasErrors) {
        this.$alert(
          'Por favor, corrija os erros antes de enviar.',
          'Erro',
          'error'
        );
        return;
      }

      this.$store
        .dispatch(
          `sponsorAnimals/${EDIT_SPONSOR_ANIMAL}`,
          this.$data.sponsorAnimal
        )
        .then(
          () => {
            this.$alert(this.getMessage, 'Patrocinador atualizado!', 'success');
            router.push({ name: 'sponsorAnimaisAssociados' });
          },
          (err) => {
            this.$alert(`${err.message}`, 'Erro', 'error');
          }
        );
    },
  },
  created() {
    this.sponsorAnimal = this.getSponsorAnimalById(
      this.$route.params.sponsorAnimalId
    );
    this.fetchAnimals();
    this.fetchSponsors();
  },
};
</script>

<style scoped>
.center_div {
  margin: 0 auto;
  width: 80%;
}
.custom-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}
</style>
