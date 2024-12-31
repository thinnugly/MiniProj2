<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Gestão de Patrocinadores" />
      <!--MENU TOPO-->
      <b-row class="mb-4">
        <b-col cols="2"></b-col>
        <b-col cols="8">
          <router-link
            :to="{ name: 'addSponsor' }"
            tag="button"
            class="btn btn-outline-success mr-2 mt-2"
          >
            <i class="fas fa-plus-square"></i> ADICIONAR PATROCINADOR
          </router-link>
          <router-link
            :to="{ name: 'admin' }"
            tag="button"
            class="btn btn-outline-info mr-2 mt-2"
          >
            <i class="fas fa-bars"></i> MENU PRINCIPALL
          </router-link>
          <router-link
            :to="{ name: 'sponsorAnimaisAssociados' }"
            tag="button"
            class="btn btn-outline-info mr-2 mt-2"
          >
            <i class="fas fa-dog"></i> LISTA DE ANIMAIS PATROCINADOS
          </router-link>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>

      <!--TABLE-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <table class="table table-striped">
            <thead class="thead-dark">
              <tr>
                <th scope="col">
                  NOME
                  <i
                    class="fas fa-arrow-up"
                    v-if="sortType === 1"
                    @click="sort()"
                  ></i>
                  <i class="fas fa-arrow-down" v-else @click="sort()"></i>
                </th>
                <th scope="col">ORGANIZAÇÃO</th>
                <th scope="col">VALOR DO PATROCÍNIO</th>
                <th scope="col">CONTATO</th>
                <th scope="col">OBSERVAÇÕES</th>
                <th scope="col" style="width: 100%">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sponsor of sponsors" :key="sponsor._id">
                <td class="pt-4">{{ sponsor.name }}</td>
                <td class="pt-4">{{ sponsor.organization }}</td>
                <td class="pt-4">{{ sponsor.sponsorship_value | currency }}</td>
                <td class="pt-4">{{ sponsor.contact }}</td>
                <td class="pt-4">{{ sponsor.notes }}</td>
                <td>
                  <router-link
                    :to="{
                      name: 'editSponsor',
                      params: { sponsorId: sponsor._id },
                    }"
                    tag="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-edit"></i> EDITAR
                  </router-link>
                  <button
                    @click="viewSponsor(sponsor._id)"
                    type="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-search"></i> VER
                  </button>
                  <button
                    @click="removeSponsor(sponsor._id)"
                    type="button"
                    class="btn btn-outline-danger mr-2 mt-2"
                  >
                    <i class="fas fa-trash-alt"></i> REMOVER
                  </button>
                  <button
                    @click="openAssociationModal(sponsor._id)"
                    type="button"
                    class="btn btn-outline-info mr-2 mt-2"
                  >
                    <i class="fas fa-link"></i> PATROCINAR
                  </button>
                  <button
                    @click="viewSponsorAnimalsAndGroup(sponsor._id)"
                    type="button"
                    class="btn btn-outline-info mr-2 mt-2"
                  >
                    <i class="fas fa-dog"></i> ANIMAIS PATROCINADOS
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import {
  FETCH_SPONSORS,
  REMOVE_SPONSOR,
} from '@/store/sponsors/sponsor.constants';
import { ADD_SPONSOR_ANIMAL } from '@/store/sponsors_animals/sponsorAnimals.constants';
import { FETCH_ANIMALS } from '@/store/animals/animal.constants';
import HeaderPage from '@/components/HeaderPage.vue';
import { mapGetters } from 'vuex';
import Swal from 'sweetalert2';
import sponsorAnimalService from '../../api/sponsorAnimal.service';

export default {
  name: 'ManageSponsors',
  components: {
    HeaderPage,
  },
  data() {
    return {
      sponsors: [],
      animals: [],
      sortType: 1,
    };
  },
  computed: {
    ...mapGetters('sponsor', ['getSponsors', 'getMessage']),
    ...mapGetters('animal', ['getAnimals']),
    ...mapGetters('sponsorAnimals', ['getMessage']),
  },
  methods: {
    fetchAnimals() {
      return this.$store.dispatch(`animal/${FETCH_ANIMALS}`).then(() => {
        this.animals = this.getAnimals;
      });
    },
    openAssociationModal(id) {
      const sponsor = this.sponsors.find((sponsor) => sponsor._id === id);

      this.fetchAnimals()
        .then(() => {
          this.$fire({
            title: sponsor.name,
            html: this.associationTemplate(sponsor, this.animals),
            showCancelButton: true,
            confirmButtonText: 'Associar',
            preConfirm: () => {
              const sponsor_id = document.getElementById('sponsor_id').value;
              const animal_id = document.getElementById('animal').value;
              const notes = document.getElementById('notes').value;

              if (!animal_id) {
                Swal.showValidationMessage('Por favor, selecione um animal.');
                return false;
              }
              const payload = {
                sponsor_id,
                animal_id,
                notes,
              };

              this.$store
                .dispatch(`sponsorAnimals/${ADD_SPONSOR_ANIMAL}`, payload)
                .then(
                  () => {
                    this.$alert(
                      this.getMessage,
                      'A associação foi adicionada com sucesso!',
                      'success'
                    );
                  },
                  (err) => {
                    this.$alert(`${err.message}`, 'Erro', 'error');
                  }
                );
              // alert(`Patrocinador: ${sponsorId}`, 'Informação', 'info');
              // alert(`Animal: ${animalId}`, 'Informação', 'info');
              // alert(`Notes: ${notes}`, 'Informação', 'info');

              return { sponsor_id, animal_id, notes };
            },
          });
        })
        .catch((err) => {
          this.$alert(
            `Erro ao carregar animais: ${err.message}`,
            'Erro',
            'error'
          );
        });
    },
    fetchSponsors() {
      this.$store.dispatch(`sponsor/${FETCH_SPONSORS}`).then(
        () => {
          this.sponsors = this.getSponsors;
        },
        (err) => {
          this.$alert(`${err.message}`, 'Erro', 'error');
        }
      );
    },
    sort() {
      this.sponsors.sort(this.compareNames);
      this.sortType *= -1;
    },
    compareNames(u1, u2) {
      if (u1.name > u2.name) return 1 * this.sortType;
      else if (u1.name < u2.name) return -1 * this.sortType;
      else return 0;
    },

    viewSponsor(id) {
      const sponsor = this.sponsors.find((sponsor) => sponsor._id === id);

      this.$fire({
        title: sponsor.name,
        html: this.generateTemplate(sponsor),
        imageUrl: sponsor.logoUrl,
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Logo do patrocinador',
      });
    },

    async viewSponsorAnimalsAndGroup(id) {
      const sponsor = this.sponsors.find((sponsor) => sponsor._id === id);
      const token = this.$store.state.auth.token;
      const sponsorId = sponsor._id;

      try {
        const animals = await sponsorAnimalService.getAnimalsBySponsorId(
          token,
          sponsorId
        );
        this.$fire({
          title: sponsor.name,
          html: this.generateTemplateSponsorAnimalsAndGroup(animals, sponsor),
          imageUrl: sponsor.logoUrl,
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: 'Logo do patrocinador',
        });
      } catch (error) {
        this.$alert('', error.message);
      }
    },
    generateTemplateSponsorAnimalsAndGroup(animals, sponsor) {
      let response = `
    <h4>Animais Patrocinados por ${sponsor.name}</h4>
    <br>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ANIMAL</th>
          <th>GROUP</th>
        </tr>
      </thead>
      <tbody>
  `;

      animals.forEach((animal) => {
        response += `
      <tr>
        <td>${animal.animalName}</td>
        <td>${animal.species}</td>
      </tr>
    `;
      });

      response += `
      </tbody>
    </table>
  `;

      return response;
    },
    generateTemplate(sponsor) {
      let response = `
            <h4>Organização: ${sponsor.organization}</h4>
            <h5>Valor do Patrocínio: ${this.$options.filters.currency(
              sponsor.sponsorship_value
            )}</h5>
            <p>Contato: ${sponsor.contact}</p>
            <p>Notas: ${sponsor.notes}</p>
        `;
      return response;
    },
    associationTemplate(sponsor, animals) {
      let options = animals
        .map(
          (animal) => `<option value="${animal._id}">${animal.name}</option>`
        )
        .join('');

      let response = `
    <form id="sponsor-animal-form" class="container mt-4">
      <h4>Associação de Patrocinador e Animal</h4>

      <div class="mb-3">
        <input type="text" class="form-control" id="name" name="name" value="${sponsor.name}" readonly required>
        <input type="hidden" id="sponsor_id" name="sponsor_id" value="${sponsor._id}">
      </div>

      <div class="mb-3">
        <select class="form-select form-control" id="animal" name="animal" required>
          <option value="">-- SELECIONA ANIMAL --</option>
          ${options}
         </select>
      </div>

      <div class="mb-3">
        <textarea 
          class="form-control" 
          id="notes" 
          name="notes" 
          rows="3"
        >
          Patrocinador/a deste animal - ${sponsor.name}
        </textarea>
      </div>

    </form>
  `;
      return response;
    },
    removeSponsor(id) {
      this.$confirm(
        'Se sim, clique em OK',
        'Deseja mesmo remover o patrocinador?',
        'warning',
        { confirmButtonText: 'OK', cancelButtonText: 'Cancelar' }
      ).then(
        () => {
          this.$store.dispatch(`sponsor/${REMOVE_SPONSOR}`, id).then(
            () => {
              this.$alert(this.getMessage, 'Patrocinador removido!', 'success');
              this.fetchSponsors();
            },
            (err) => {
              // Captura o erro e exibe a mensagem.
              this.$alert(err.message, 'Erro ao remover patrocinador', 'error');
            }
          );
        },
        () => {
          this.$alert('Remoção cancelada!', 'Informação', 'info');
        }
      );
    },
  },
  created() {
    this.fetchSponsors();
  },
};
</script>
<style scoped>
textarea {
  text-align: left;
  padding-left: 0;
}
</style>
