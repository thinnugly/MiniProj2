<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Adicionar Expert" />

      <!--FORM-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="8">
          <form @submit.prevent="addExpert">
            <div class="form-group">
              <label for="txtName" class="custom-label">NOME</label>
              <input
                v-model="expert.name"
                type="text"
                class="form-control form-control-lg"
                id="txtName"
                placeholder="Escreva o nome"
                required
                @input="validateText('name')"
              />
              <strong v-if="errors.name" class="text-danger">{{
                errors.name
              }}</strong>
            </div>
            <div class="form-group">
              <label for="txtInstitution" class="custom-label"
                >INSTITUIÇÃO</label
              >
              <input
                v-model="expert.institution"
                type="text"
                class="form-control form-control-lg"
                id="txtInstitution"
                placeholder="Escreva a instituição"
                required
                @input="validateText('institution')"
              />
              <strong v-if="errors.institution" class="text-danger">{{
                errors.institution
              }}</strong>
            </div>
            <div class="form-group">
              <label for="txtContacto" class="custom-label">CONTATO</label>
              <input
                v-model="expert.contacto"
                type="text"
                class="form-control form-control-lg"
                id="txtContacto"
                placeholder="Escreva o contato"
                required
                @input="validateNumber('contacto')"
              />
              <strong v-if="errors.contacto" class="text-danger">{{
                errors.contacto
              }}</strong>
            </div>
            <div class="form-group">
              <label for="txtAreasExpertise" class="custom-label"
                >ESPECIALIDADE</label
              >
              <select
                v-model="expert.areas_expertise"
                class="form-control form-control-lg"
                id="txtAreasExpertise"
                multiple
                required
              >
                <option value="Felidae">Felidae (Felinos)</option>
                <option value="Canidae">Canidae (Canídeos)</option>
                <option value="Ursidae">Ursidae (Ursos)</option>
                <option value="Cervidae">Cervidae (Cervídeos)</option>
                <option value="Bovidae">Bovidae (Bovinos e Antílopes)</option>
                <option value="Equidae">Equidae (Equinos)</option>
                <option value="Suidae">Suidae (Porcos e Javali)</option>
                <option value="Leporidae">Leporidae (Coelhos e Lebres)</option>
                <option value="Muridae">Muridae (Ratos e Camundongos)</option>
                <option value="Testudinidae">
                  Testudinidae (Tartarugas e Cágados)
                </option>
                <option value="Psittacidae">
                  Psittacidae (Papagaios e Periquitos)
                </option>
                <option value="Accipitridae">
                  Accipitridae (Águias e Falcões)
                </option>
                <option value="Outras">Outras</option>
              </select>
              <strong v-if="errors.areas_expertise" class="text-danger">{{
                errors.areas_expertise
              }}</strong>
            </div>
            <div class="form-group">
              <label for="txtNotes" class="custom-label">OBSERVAÇÕES</label>
              <textarea
                v-model="expert.notes"
                class="form-control form-control-lg"
                id="txtNotes"
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
              <i class="fas fa-plus-circle"></i> ADICIONAR
            </button>
            <router-link
              :to="{ name: 'listExperts' }"
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
import { ADD_EXPERT } from '@/store/experts/expert.constants';
import HeaderPage from '@/components/HeaderPage.vue';
import router from '@/router';
import { mapGetters } from 'vuex';

export default {
  name: 'AddExpert',
  components: {
    HeaderPage,
  },
  data: () => {
    return {
      expert: {
        name: '',
        institution: '',
        contacto: '',
        areas_expertise: [],
        notes: '',
      },
      errors: {
        name: '',
        institution: '',
        contacto: '',
        areas_expertise: '',
        notes: '',
      },
    };
  },
  computed: {
    ...mapGetters('expert', ['getMessage']),
    hasErrors() {
      return Object.values(this.errors).some((error) => error !== '');
    },
  },
  methods: {
    validateText(field) {
      const value = this.expert[field];
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        this.errors[field] = 'Este campo deve conter apenas letras.';
      } else {
        this.errors[field] = '';
      }
    },
    validateNumber(field) {
      const value = this.expert[field];
      if (!/^\d*$/.test(value)) {
        this.errors[field] = 'Este campo deve conter apenas números.';
      } else {
        this.errors[field] = '';
      }
    },
    validateAreasExpertise() {
      if (this.expert.areas_expertise.length === 0) {
        this.errors.areas_expertise =
          'Por favor, selecione pelo menos uma família biológica.';
      } else {
        this.errors.areas_expertise = '';
      }
    },
    addExpert() {
      this.validateAreasExpertise();

      if (this.hasErrors) {
        this.$alert(
          'Por favor, corrija os erros antes de enviar.',
          'Erro',
          'error'
        );
        return;
      }

      this.$store.dispatch(`expert/${ADD_EXPERT}`, this.expert).then(
        () => {
          this.$alert(this.getMessage, 'Expert adicionado!', 'success');
          router.push({ name: 'listExperts' });
        },
        (err) => {
          this.$alert(`${err.message}`, 'Erro', 'error');
        }
      );
    },
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
