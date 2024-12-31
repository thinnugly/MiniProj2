<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Editar Associação de Especialista e Animal" />

      <!--FORM-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="8">
          <form @submit.prevent="update">
            <div class="form-group">
              <label for="animal_id" class="custom-label">ANIMAL</label>
              <select
                id="animal_id"
                v-model="expertAnimal.animal_id"
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
              <label for="expert_id" class="custom-label">ESPECIALISTA</label>
              <select
                id="expert_id"
                v-model="expertAnimal.expert_id"
                class="form-control form-control-lg"
                required
              >
                <option
                  v-for="expert in experts"
                  :key="expert._id"
                  :value="expert._id"
                >
                  {{ expert.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="association_type" class="custom-label"
                >TIPO DE ASSOCIAÇÃO</label
              >
              <select
                id="association_type"
                v-model="expertAnimal.association_type"
                class="form-control form-control-lg"
                required
              >
                <option value="Especialista">ESPECIALISTA</option>
                <option value="Consultor">CONSULTOR</option>
              </select>
            </div>
            <div class="form-group">
              <label for="notes" class="custom-label">OBSERVAÇÕES</label>
              <textarea
                v-model="expertAnimal.notes"
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
              :to="{ name: 'expertAnimaisAssociados' }"
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
import { EDIT_EXPERT_ANIMAL } from '@/store/experts_animals/expertAnimals.constants';
import { FETCH_ANIMALS } from '@/store/animals/animal.constants';
import { FETCH_EXPERTS } from '@/store/experts/expert.constants';
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
      experts: [],
      expertAnimal: {
        expert_id: '',
        animal_id: '',
        association_type: '',
        notes: '',
      },
      errors: {
        expert_id: '',
        animal_id: '',
        association_type: '',
      },
    };
  },
  computed: {
    ...mapGetters('expertAnimals', ['getExpertAnimalById', 'getMessage']),
    ...mapGetters('animal', ['getAnimals']),
    ...mapGetters('expert', ['getExperts']),
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
    fetchExperts() {
      return this.$store.dispatch(`expert/${FETCH_EXPERTS}`).then(() => {
        this.experts = this.getExperts;
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
          `expertAnimals/${EDIT_EXPERT_ANIMAL}`,
          this.$data.expertAnimal
        )
        .then(
          () => {
            this.$alert(
              this.getMessage,
              'A associação foi atualizada com sucesso!',
              'success'
            );
            router.push({ name: 'expertAnimaisAssociados' });
          },
          (err) => {
            this.$alert(`${err.message}`, 'Erro', 'error');
          }
        );
    },
  },
  created() {
    this.expertAnimal = this.getExpertAnimalById(
      this.$route.params.expertAnimalId
    );
    this.fetchAnimals();
    this.fetchExperts();
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
