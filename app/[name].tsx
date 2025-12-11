import { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, Image } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";

interface PokemonDetail {
  name: string;
  sprites: {
    front_default: string;
    back_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
  species: {
    url: string;
  };
}

interface Evolution {
  name: string;
  image: string;
}

export default function Details() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);

  async function parseEvolutionChain(chain: any): Promise<Evolution[]> {
    const evolutions: Evolution[] = [];

    async function traverse(node: any) {
      if (node.species) {
        // Fetch individual Pokemon data to get the correct image
        try {
          const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${node.species.name}`);
          const pokemonData = await pokemonResponse.json();
          evolutions.push({
            name: node.species.name,
            image: pokemonData.sprites.other["official-artwork"].front_default || pokemonData.sprites.front_default,
          });
        } catch {
          // Fallback to ID-based URL
          const id = node.species.url.split("/")[6];
          evolutions.push({
            name: node.species.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/${id}.png`,
          });
        }
      }

      if (node.evolves_to && node.evolves_to.length > 0) {
        for (const evo of node.evolves_to) {
          await traverse(evo);
        }
      }
    }

    await traverse(chain);
    return evolutions;
  }

  useEffect(() => {
    async function fetchPokemonByName(pokemonName: string) {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
        );
        const data = await response.json();
        setPokemon(data);

        // Fetch species data to get evolution chain URL
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();

        // Fetch evolution chain
        if (speciesData.evolution_chain) {
          const chainResponse = await fetch(speciesData.evolution_chain.url);
          const chainData = await chainResponse.json();
          
          // Parse evolution chain
          const evolutionList = await parseEvolutionChain(chainData.chain);
          setEvolutions(evolutionList);
        }
      } catch (e) {
        console.log(e);
      }
    }

    if (name) {
      fetchPokemonByName(name as string);
    }
  }, [name]);

  return (
    <>
      <Stack.Screen options={{ title: name }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {pokemon ? (
          <View>
            <View style={styles.card}>
              <Text style={styles.name}>{pokemon.name}</Text>
              <Image
                source={{ uri: pokemon.sprites.front_default }}
                style={styles.image}
              />
              <Text style={styles.label}>Height: {pokemon.height / 10} m</Text>
              <Text style={styles.label}>Weight: {pokemon.weight / 10} kg</Text>
              <Text style={styles.label}>
                Types: {pokemon.types.map((t: any) => t.type.name).join(", ")}
              </Text>
            </View>

            {evolutions.length > 1 && (
              <View style={styles.evolutionSection}>
                <Text style={styles.sectionTitle}>Evolutions</Text>
                <View style={styles.evolutionContainer}>
                  {evolutions.map((evo, index) => (
                    <View key={evo.name} style={styles.evolutionCard}>
                      <Image source={{ uri: evo.image }} style={styles.evolutionImage} />
                      <Text style={styles.evolutionName}>{evo.name}</Text>
                      {index < evolutions.length - 1 && (
                        <Text style={styles.arrow}>→</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  evolutionSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  evolutionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  evolutionCard: {
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 12,
  },
  evolutionImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  evolutionName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  arrow: {
    fontSize: 24,
    marginHorizontal: 8,
  },
});