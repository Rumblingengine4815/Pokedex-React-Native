import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";


interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  name: string;
  url: string;
}

const colorsByType: { [key: string]: string } = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  psychic: "#F85888",
  ice: "#98D8D8",
  dragon: "#7038F8",      
  dark: "#705848",
  fairy: "#EE99AC",
  normal: "#A8A878",
  fighting: "#C03028",
  flying: "#A890F0",
  poison: "#A040A0",
  ground: "#E0C068",
  rock: "#B8A038",
  bug: "#A8B820",
  ghost: "#705898",
  steel: "#B8B8D0",
};
export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    // fetch pokemons
    fetchPokemons();
  }, []);

  async function fetchPokemons() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=70"
      );
      const data = await response.json();

      // Fetch detailed info for each pokemon in parallel
      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default, // main sprite
            imageBack: details.sprites.back_default, // back sprite
            // normalize types to { name, url }
            types: details.types.map((t: any) => ({ name: t.type.name, url: t.type.url })),
          };
        })
      );

      console.log(detailedPokemons);
      setPokemons(detailedPokemons);
    }catch(e) {
      console.log(e);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {pokemons.map((pokemon) => (
        <Link
          key={pokemon.name}
          href={{
            pathname: "/[name]",
            params: { name: pokemon.name },
          }}
          asChild
        >
          <View
            style={{
              ...styles.card,
              backgroundColor: colorsByType[pokemon.types?.[0]?.name] ?? "#fff",
              padding: 20,
              borderRadius: 20,
            }}
          >
            <Text style={styles.name}>{pokemon.name}</Text>
            <Text style={styles.type}>{pokemon.types?.[0]?.name ?? ""}</Text>
            <View style={styles.imageRow}>
              <Image
                source={{ uri: pokemon.image }}
                style={{
                  ...styles.mainImage,
                  ...styles.imageSpacing,
                }}
              />
              <Image source={{ uri: pokemon.imageBack }} style={styles.backImage} />
            </View>
          </View>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
  imageRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  mainImage: {
    width: 150,
    height: 100,
  },
  backImage: {
    width: 100,
    height: 100,
  },
  imageSpacing: {
    marginLeft: 10,
  },
});