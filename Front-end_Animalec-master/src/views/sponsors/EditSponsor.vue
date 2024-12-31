<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Editar Patrocinador" />

      <!--FORM-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="8">
          <form @submit.prevent="update">
            <div class="form-group">
              <label for="txtName" class="custom-label">NOME</label>
              <input
                v-model="sponsor.name"
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
              <label for="txtOrganization" class="custom-label"
                >ORGANIZAÇÃO</label
              >
              <input
                v-model="sponsor.organization"
                type="text"
                class="form-control form-control-lg"
                id="txtOrganization"
                placeholder="Escreva a organização"
                required
                @input="validateText('organization')"
              />
              <strong v-if="errors.organization" class="text-danger">{{
                errors.organization
              }}</strong>
            </div>
            <div class="form-group">
              <label for="txtContact" class="custom-label">CONTATO</label>
              <input
                v-model="sponsor.contact"
                type="text"
                class="form-control form-control-lg"
                id="txtContact"
                placeholder="Escreva o contato"
                required
                @input="validateNumber('contact')"
              />
              <strong v-if="errors.contact" class="text-danger">{{
                errors.contact
              }}</strong>
            </div>
            <div class="form-group">
              <label for="txtSponsorshipValue" class="custom-label"
                >VALOR DO PATROCÍNIO</label
              >
              <input
                v-model="sponsor.sponsorship_value"
                type="text"
                class="form-control form-control-lg"
                id="txtSponsorshipValue"
                placeholder="Escreva o valor do patrocínio"
                required
                @input="validateNumber('sponsorship_value')"
              />
              <strong v-if="errors.sponsorship_value" class="text-danger">{{
                errors.sponsorship_value
              }}</strong>
            </div>
            <div class="form-group">
              <label for="txtNotes" class="custom-label">OBSERVAÇÕES</label>
              <textarea
                v-model="sponsor.notes"
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
              <i class="fas fa-edit"></i> ATUALIZAR
            </button>
            <router-link
              :to="{ name: 'listSponsors' }"
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
import { EDIT_SPONSOR } from '@/store/sponsors/sponsor.constants';
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
      sponsor: {
        name: '',
        organization: '',
        contact: '',
        sponsorship_value: '',
        notes: '',
      },
      errors: {
        name: '',
        organization: '',
        contact: '',
        sponsorship_value: '',
      },
    };
  },
  computed: {
    ...mapGetters('sponsor', ['getSponsorById', 'getMessage']),
    hasErrors() {
      return Object.values(this.errors).some((error) => error !== '');
    },
  },
  methods: {
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

      this.$store.dispatch(`sponsor/${EDIT_SPONSOR}`, this.$data.sponsor).then(
        () => {
          this.$alert(this.getMessage, 'Patrocinador atualizado!', 'success');
          router.push({ name: 'listSponsors' });
        },
        (err) => {
          this.$alert(`${err.message}`, 'Erro', 'error');
        }
      );
    },
  },
  created() {
    this.sponsor = this.getSponsorById(this.$route.params.sponsorId);
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
