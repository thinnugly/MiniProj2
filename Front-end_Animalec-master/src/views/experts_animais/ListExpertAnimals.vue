<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Gestão de Associação de Especialista e Animal" />
      <!--MENU TOPO-->
      <b-row class="mb-4">
        <b-col cols="2"></b-col>
        <b-col>
          <router-link
            :to="{ name: 'listExperts' }"
            tag="button"
            class="btn btn-outline-info mr-2 mt-2"
          >
            <i class="fas fa-bars"></i> MENU PRINCIPAL
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
                  ANIMAL
                  <i
                    class="fas fa-arrow-up"
                    v-if="sortType === 1"
                    @click="sort()"
                  ></i>
                  <i class="fas fa-arrow-down" v-else @click="sort()"></i>
                </th>
                <th scope="col">ESPECIALISTA</th>
                <th scope="col">TIPO DE ASSOCIAÇÃO</th>
                <th scope="col">OBSERVAÇÕES</th>
                <th scope="col">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="expertAnimal of expertAnimals" :key="expertAnimal._id">
                <td class="pt-4">
                  <span v-if="expertAnimal.animalName">
                    {{ expertAnimal.animalName }}
                  </span>
                  <span v-else>
                    {{
                      expertAnimal.isLoading
                        ? 'Carregando...'
                        : 'Erro ao carregar nome'
                    }}
                  </span>
                </td>
                <td class="pt-4">
                  <span v-if="expertAnimal.expertName">
                    {{ expertAnimal.expertName }}
                  </span>
                  <span v-else>
                    {{
                      expertAnimal.isLoading
                        ? 'Carregando...'
                        : 'Erro ao carregar nome'
                    }}
                  </span>
                </td>
                <td class="pt-4">{{ expertAnimal.association_type }}</td>
                <td class="pt-4">{{ expertAnimal.notes }}</td>
                <td>
                  <router-link
                    :to="{
                      name: 'editExpertAnimal',
                      params: { expertAnimalId: expertAnimal._id },
                    }"
                    tag="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-edit"></i> EDITAR
                  </router-link>
                  <button
                    @click="viewExpertAnimal(expertAnimal._id)"
                    type="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-search"></i> VER
                  </button>
                  <button
                    @click="removeExpertAnimal(expertAnimal._id)"
                    type="button"
                    class="btn btn-outline-danger mr-2 mt-2"
                  >
                    <i class="fas fa-trash-alt"></i> REMOVER
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
  FETCH_EXPERT_ANIMALS,
  REMOVE_EXPERT_ANIMAL,
} from '@/store/experts_animals/expertAnimals.constants';
import HeaderPage from '@/components/HeaderPage.vue';
import expertAnimalService from '@/api/expertAnimal.service';
import { mapGetters } from 'vuex';

export default {
  name: 'ManageSponsorAnimals',
  components: {
    HeaderPage,
  },
  data() {
    return {
      expertAnimals: [],
      sortType: 1,
      isLoading: true,
      error: null,
    };
  },
  computed: {
    ...mapGetters('expertAnimals', ['getExpertAnimals', 'getMessage']),
  },
  methods: {
    async getExpertName(expertId, index) {
      this.$set(this.expertAnimals, index, {
        ...this.expertAnimals[index],
        isLoading: true,
      });
      try {
        const token = this.$store.state.auth.token;
        const expertName = await expertAnimalService.getExpertNameById(
          token,
          expertId
        );
        this.$set(this.expertAnimals, index, {
          ...this.expertAnimals[index],
          expertName,
          isLoading: false,
        });
      } catch (error) {
        this.$set(this.expertAnimals, index, {
          ...this.expertAnimals[index],
          isLoading: false,
        });
        this.error = error.message;
      }
    },
    async getAnimalName(animalId, index) {
      this.$set(this.expertAnimals, index, {
        ...this.expertAnimals[index],
        isLoading: true,
      });
      try {
        const token = this.$store.state.auth.token;
        const animalName = await expertAnimalService.getAnimalNameById(
          token,
          animalId
        );
        this.$set(this.expertAnimals, index, {
          ...this.expertAnimals[index],
          animalName,
          isLoading: false,
        });
      } catch (error) {
        this.$set(this.expertAnimals, index, {
          ...this.expertAnimals[index],
          isLoading: false,
        });
        this.error = error.message;
      }
    },
    fetchExpertAnimals() {
      this.$store.dispatch(`expertAnimals/${FETCH_EXPERT_ANIMALS}`).then(
        () => {
          this.expertAnimals = this.getExpertAnimals;
          // Chama a função para obter o nome do patrocinador para cada animal
          this.expertAnimals.forEach((expertAnimal, index) => {
            this.getExpertName(expertAnimal.expert_id, index);
            this.getAnimalName(expertAnimal.animal_id, index);
          });
        },
        (err) => {
          this.$alert(`${err.message}`, 'Erro', 'error');
        }
      );
    },
    sort() {
      this.sponsorAnimals.sort(this.compareNames);
      this.sortType *= -1;
    },
    compareNames(u1, u2) {
      if (u1.animalName > u2.animalName) return 1 * this.sortType;
      else if (u1.animalName < u2.animalName) return -1 * this.sortType;
      else return 0;
    },

    viewExpertAnimal(id) {
      const expertAnimal = this.expertAnimals.find(
        (expertAnimal) => expertAnimal._id === id
      );

      this.$fire({
        title: expertAnimal.animalName,
        html: this.generateTemplate(expertAnimal),
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Imagem do animal',
      });
    },

    generateTemplate(expertAnimal) {
      let response = `
              <h4>Especialista: ${expertAnimal.expertName}</h4>
              <h5>Animal: ${expertAnimal.animalName}</h5>
              <h5>Tipo de associação: ${expertAnimal.association_type}</h5>
              <p>Notas: ${expertAnimal.notes}</p>
          `;
      return response;
    },
    removeExpertAnimal(id) {
      this.$confirm(
        'Se sim, clique em OK',
        'Deseja mesmo remover a associação entre especialista e animal?',
        'warning',
        { confirmButtonText: 'OK', cancelButtonText: 'Cancelar' }
      ).then(
        () => {
          this.$store
            .dispatch(`expertAnimals/${REMOVE_EXPERT_ANIMAL}`, id)
            .then(() => {
              this.$alert(this.getMessage, 'Associação removida!', 'success');
              this.fetchExpertAnimals();
            });
        },
        () => {
          this.$alert('Remoção cancelada!', 'Informação', 'info');
        }
      );
    },
  },
  created() {
    this.fetchExpertAnimals();
  },
};
</script>
