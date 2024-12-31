<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Gestão de Animais Patrocinados" />
      <!--MENU TOPO-->
      <b-row class="mb-4">
        <b-col cols="2"></b-col>
        <b-col>
          <router-link
            :to="{ name: 'listSponsors' }"
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
                <th scope="col">PATROCINADOR</th>
                <th scope="col">OBSERVAÇÕES</th>
                <th scope="col">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="sponsorAnimal of sponsorAnimals"
                :key="sponsorAnimal._id"
              >
                <td class="pt-4">
                  <span v-if="sponsorAnimal.animalName">
                    {{ sponsorAnimal.animalName }}
                  </span>
                  <span v-else>
                    {{
                      sponsorAnimal.isLoading
                        ? 'Carregando...'
                        : 'Erro ao carregar nome'
                    }}
                  </span>
                </td>
                <td>
                  <span v-if="sponsorAnimal.sponsorName">
                    {{ sponsorAnimal.sponsorName }}
                  </span>
                  <span v-else>
                    {{
                      sponsorAnimal.isLoading
                        ? 'Carregando...'
                        : 'Erro ao carregar nome'
                    }}
                  </span>
                </td>
                <td class="pt-4">{{ sponsorAnimal.notes }}</td>
                <td>
                  <router-link
                    :to="{
                      name: 'editSponsorAnimal',
                      params: { sponsorAnimalId: sponsorAnimal._id },
                    }"
                    tag="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-edit"></i> EDITAR
                  </router-link>
                  <button
                    @click="viewSponsorAnimal(sponsorAnimal._id)"
                    type="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-search"></i> VER
                  </button>
                  <button
                    @click="removeSponsorAnimal(sponsorAnimal._id)"
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
  FETCH_SPONSOR_ANIMALS,
  REMOVE_SPONSOR_ANIMAL,
} from '@/store/sponsors_animals/sponsorAnimals.constants';
import HeaderPage from '@/components/HeaderPage.vue';
import sponsorAnimalService from '@/api/sponsorAnimal.service';
import { mapGetters } from 'vuex';

export default {
  name: 'ManageSponsorAnimals',
  components: {
    HeaderPage,
  },
  data() {
    return {
      sponsorAnimals: [],
      sortType: 1,
      isLoading: true,
      error: null,
    };
  },
  computed: {
    ...mapGetters('sponsorAnimals', ['getSponsorAnimals', 'getMessage']),
  },
  methods: {
    async getSponsorName(sponsorId, index) {
      this.$set(this.sponsorAnimals, index, {
        ...this.sponsorAnimals[index],
        isLoading: true,
      });
      try {
        const token = this.$store.state.auth.token;
        const sponsorName = await sponsorAnimalService.getSponsorNameById(
          token,
          sponsorId
        );
        this.$set(this.sponsorAnimals, index, {
          ...this.sponsorAnimals[index],
          sponsorName,
          isLoading: false,
        });
      } catch (error) {
        this.$set(this.sponsorAnimals, index, {
          ...this.sponsorAnimals[index],
          isLoading: false,
        });
        this.error = error.message;
      }
    },
    async getAnimalName(animalId, index) {
      this.$set(this.sponsorAnimals, index, {
        ...this.sponsorAnimals[index],
        isLoading: true,
      });
      try {
        const token = this.$store.state.auth.token;
        const animalName = await sponsorAnimalService.getAnimalNameById(
          token,
          animalId
        );
        this.$set(this.sponsorAnimals, index, {
          ...this.sponsorAnimals[index],
          animalName,
          isLoading: false,
        });
      } catch (error) {
        this.$set(this.sponsorAnimals, index, {
          ...this.sponsorAnimals[index],
          isLoading: false,
        });
        this.error = error.message;
      }
    },
    fetchSponsorAnimals() {
      this.$store.dispatch(`sponsorAnimals/${FETCH_SPONSOR_ANIMALS}`).then(
        () => {
          this.sponsorAnimals = this.getSponsorAnimals;
          // Chama a função para obter o nome do patrocinador para cada animal
          this.sponsorAnimals.forEach((sponsorAnimal, index) => {
            this.getSponsorName(sponsorAnimal.sponsor_id, index);
            this.getAnimalName(sponsorAnimal.animal_id, index);
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

    viewSponsorAnimal(id) {
      const sponsorAnimal = this.sponsorAnimals.find(
        (sponsorAnimal) => sponsorAnimal._id === id
      );

      this.$fire({
        title: sponsorAnimal.animalName,
        html: this.generateTemplate(sponsorAnimal),
        imageUrl: sponsorAnimal.animalImageUrl,
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Imagem do animal',
      });
    },

    generateTemplate(sponsorAnimal) {
      let response = `
              <h4>Patrocinador: ${sponsorAnimal.sponsorName}</h4>
              <h5>Animal: ${sponsorAnimal.animalName}</h5>
              <p>Notas: ${sponsorAnimal.notes}</p>
          `;
      return response;
    },
    removeSponsorAnimal(id) {
      this.$confirm(
        'Se sim, clique em OK',
        'Deseja mesmo remover a associação entre patrocinador e animal?',
        'warning',
        { confirmButtonText: 'OK', cancelButtonText: 'Cancelar' }
      ).then(
        () => {
          this.$store
            .dispatch(`sponsorAnimals/${REMOVE_SPONSOR_ANIMAL}`, id)
            .then(() => {
              this.$alert(this.getMessage, 'Associação removida!', 'success');
              this.fetchSponsorAnimals();
            });
        },
        () => {
          this.$alert('Remoção cancelada!', 'Informação', 'info');
        }
      );
    },
  },
  created() {
    this.fetchSponsorAnimals();
  },
};
</script>
