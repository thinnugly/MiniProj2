<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Gestão de Especialistas" />
      <!--MENU TOPO-->
      <b-row class="mb-4">
        <b-col cols="2"></b-col>
        <b-col>
          <router-link
            :to="{ name: 'addExpert' }"
            tag="button"
            class="btn btn-outline-success mr-2 mt-2"
          >
            <i class="fas fa-plus-square"></i> ADICIONAR EXPERT
          </router-link>
          <router-link
            :to="{ name: 'admin' }"
            tag="button"
            class="btn btn-outline-info mr-2 mt-2"
          >
            <i class="fas fa-bars"></i> MENU PRINCIPAL
          </router-link>
          <router-link
            :to="{ name: 'expertAnimaisAssociados' }"
            tag="button"
            class="btn btn-outline-info mr-2 mt-2"
          >
            <i class="fas fa-dog"></i>LISTA DE ANIMAIS COM ESPECIALISTAS
            ASSOCIADOS
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
                <th scope="col">INSTITUIÇÃO</th>
                <th scope="col">ÁREAS DE ESPECIALIZAÇÃO</th>
                <th scope="col">CONTACTO</th>
                <th scope="col">OBSERVAÇÕES</th>
                <th scope="col" style="width: 100%">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="expert of experts" :key="expert._id">
                <td class="pt-4">{{ expert.name }}</td>
                <td class="pt-4">{{ expert.institution }}</td>
                <td class="pt-4">{{ expert.areas_expertise.join(', ') }}</td>
                <td class="pt-4">{{ expert.contacto }}</td>
                <td class="pt-4">{{ expert.notes }}</td>
                <td>
                  <router-link
                    :to="{
                      name: 'editExpert',
                      params: { expertId: expert._id },
                    }"
                    tag="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-edit"></i> EDITAR
                  </router-link>
                  <button
                    @click="viewExpert(expert._id)"
                    type="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-search"></i> VER
                  </button>
                  <button
                    @click="removeExpert(expert._id)"
                    type="button"
                    class="btn btn-outline-danger mr-2 mt-2"
                  >
                    <i class="fas fa-trash-alt"></i> REMOVER
                  </button>
                  <button
                    @click="openAssociationModal(expert._id)"
                    type="button"
                    class="btn btn-outline-info mr-2 mt-2"
                  >
                    <i class="fas fa-link"></i> ASSOCIAR
                  </button>
                  <button
                    @click="viewExpertAnimalsAndGroup(expert._id)"
                    type="button"
                    class="btn btn-outline-info mr-2 mt-2"
                  >
                    <i class="fas fa-dog"></i> ANIMAIS ASSOCIADOS
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
import { FETCH_EXPERTS, REMOVE_EXPERT } from '@/store/experts/expert.constants';
import HeaderPage from '@/components/HeaderPage.vue';
import { mapGetters } from 'vuex';
import expertAnimalService from '@/api/expertAnimal.service';
import { FETCH_ANIMALS } from '@/store/animals/animal.constants';
import { ADD_EXPERT_ANIMAL } from '@/store/experts_animals/expertAnimals.constants';
import Swal from 'sweetalert2';

export default {
  name: 'ManageExperts',
  components: {
    HeaderPage,
  },
  data() {
    return {
      experts: [],
      sortType: 1, // Default sorting order is ascending
      animals: [],
    };
  },
  computed: {
    ...mapGetters('expert', ['getExperts', 'getMessage']),
    ...mapGetters('animal', ['getAnimals']),
  },
  methods: {
    fetchAnimals() {
      return this.$store.dispatch(`animal/${FETCH_ANIMALS}`).then(() => {
        this.animals = this.getAnimals;
      });
    },
    fetchExperts() {
      this.$store.dispatch(`expert/${FETCH_EXPERTS}`).then(
        () => {
          this.experts = this.getExperts;
        },
        (err) => {
          this.$alert(`${err.message}`, 'Erro', 'error');
        }
      );
    },
    sort() {
      this.experts.sort(this.compareNames);
      this.sortType *= -1;
    },
    compareNames(u1, u2) {
      if (u1.name > u2.name) return 1 * this.sortType;
      else if (u1.name < u2.name) return -1 * this.sortType;
      else return 0;
    },

    viewExpert(id) {
      const expert = this.experts.find((expert) => expert._id === id);

      this.$fire({
        title: expert.name,
        html: this.generateTemplate(expert),
        imageUrl: expert.profilePictureUrl,
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Foto do expert',
      });
    },

    generateTemplate(expert) {
      let response = `
              <h4>Instituição: ${expert.institution}</h4>
              <h5>Áreas de Especialização: ${expert.areas_expertise.join(
                ', '
              )}</h5>
              <p>Contacto: ${expert.contacto}</p>
              <p>Notas: ${expert.notes}</p>
          `;
      return response;
    },

    async viewExpertAnimalsAndGroup(id) {
      const expert = this.experts.find((expert) => expert._id === id);
      const token = this.$store.state.auth.token;
      const expertId = expert._id;

      try {
        const animals = await expertAnimalService.getAnimalsByExpertId(
          token,
          expertId
        );
        this.$fire({
          title: expert.name,
          html: this.generateTemplateExpertAnimalsAndGroup(animals, expert),
          imageUrl: expert.logoUrl,
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: 'Logo do patrocinador',
        });
      } catch (error) {
        this.$alert('', error.message);
      }
    },
    generateTemplateExpertAnimalsAndGroup(animals, expert) {
      let response = `
    <h4>Animais e Especialistas por ${expert.name}</h4>
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

    openAssociationModal(id) {
      const expert = this.experts.find((expert) => expert._id === id);

      this.fetchAnimals()
        .then(() => {
          this.$fire({
            title: expert.name,
            html: this.associationTemplate(expert, this.animals),
            showCancelButton: true,
            confirmButtonText: 'Associar',
            preConfirm: () => {
              const expert_id = document.getElementById('expert_id').value;
              const animal_id = document.getElementById('animal').value;
              const association_type =
                document.getElementById('association_type').value;
              const notes = document.getElementById('notes').value;

              if (!animal_id) {
                Swal.showValidationMessage('Por favor, selecione um animal.');
                return false;
              } else if (!association_type) {
                Swal.showValidationMessage(
                  'Por favor, selecione um tipo de associação.'
                );
                return false;
              }
              const payload = {
                expert_id,
                animal_id,
                association_type,
                notes,
              };

              this.$store
                .dispatch(`expertAnimals/${ADD_EXPERT_ANIMAL}`, payload)
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
              return { expert_id, animal_id, association_type, notes };
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
    associationTemplate(expert, animals) {
      let options = animals
        .map(
          (animal) => `<option value="${animal._id}">${animal.name}</option>`
        )
        .join('');

      let response = `
    <form id="sponsor-animal-form" class="container mt-4">
      <h4>Associação de Especialista e Animal</h4>

      <div class="mb-3">
        <input type="text" class="form-control" id="name" name="name" value="${expert.name}" readonly required>
        <input type="hidden" id="expert_id" name="sponsor_id" value="${expert._id}">
      </div>

      <div class="mb-3">
        <select class="form-select form-control" id="animal" name="animal" required>
          <option value="">-- SELECIONA ANIMAL --</option>
          ${options}
         </select>
      </div>

      <div class="mb-3">
        <select class="form-select form-control" id="association_type" name="association_type" required>
          <option value="">SELECIONA TIPO DE ASSOCIAÇÃO</option>
          <option value="Especialista">ESPECIALISTA</option>
          <option value="Consultor">CONSULTOR</option>
         </select>
      </div>

      <div class="mb-3">
        <textarea 
          class="form-control" 
          id="notes" 
          name="notes" 
          rows="3"
        >
          Especialista deste animal - ${expert.name}
        </textarea>
      </div>

    </form>
  `;
      return response;
    },
    removeExpert(id) {
      this.$confirm(
        'Se sim, clique em OK',
        'Deseja mesmo remover o expert?',
        'warning',
        { confirmButtonText: 'OK', cancelButtonText: 'Cancelar' }
      ).then(
        () => {
          this.$store.dispatch(`expert/${REMOVE_EXPERT}`, id).then(
            () => {
              this.$alert(this.getMessage, 'Expert removido!', 'success');
              this.fetchExperts();
            },
            (err) => {
              // Captura o erro e exibe a mensagem.
              this.$alert(err.message, 'Erro ao remover especialista', 'error');
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
    this.fetchExperts();
  },
};
</script>
