<template>
    <div dir="ltr">
        <Bracket :flat-tree="hh_rouunds">
            <template #player="{ player }">
            {{ player.name }}
</template>
    </Bracket>
    {{ hh_rouunds[0] }}
  </div>
</template>

<script lang="ts" setup>
import Bracket from "vue-tournament-bracket";
import type { Match, MatchWithPlayer } from "~/models/group";
const groupApi = useGroup();
const groupMatchesREQ = await groupApi.getGroupMatches();
await groupMatchesREQ.fetchREQ(29);
const matches = computed(() => {
    if (groupMatchesREQ.status.value == "success" && groupMatchesREQ.data.value) {
        return groupMatchesREQ.data.value.data;
    } else {
        return [];
    }
});

const hh_rouunds = computed(() => {
    const new_rounds = matches.value.reduce((acc: Match[][], match: Match) => {
        const levelIndex = acc.findIndex((group) => {
            return group[0].level === match.level;
        });
        if (levelIndex > -1) {
            acc[levelIndex].push(match);
        } else {
            acc.push([match]);
        }
        return acc;
    }, []);
    const rr = new_rounds.map((round: MatchWithPlayer[]) => {
        const match = round.map((m) => {

            m.player1 = {
                id: m.themTeam?.id.toString(),
                name: m.themTeam?.name,
                winner: m.winner == "them" ? true : m.winner == "us" ? false : null,
            };
            m.player2 = {
                id: m.usTeam?.id.toString(),
                name: m.usTeam?.name,
                winner: m.winner == "us" ? true : m.winner == "them" ? false : null,
            };
            // console.log(new_rounds.value[new_rounds.value.length-m.level +1])
            if (m.level != 1) {
                if (
                    new_rounds.length - m.level + 1 >= 0 &&
                    new_rounds.length - m.level + 1 < new_rounds.length
                ) {
                    const parent = new_rounds[new_rounds.length - m.level + 1].find(
                        (pm) => {
                            return (
                                pm.matchQualifyThemTeamId == m.id ||
                                pm.matchQualifyUsTeamId == m.id
                            );
                        }
                    );
                    m.next = parent?.id;
                } else {
                    m.next = null;
                }
            }
            return m

        });
        return match
    });
    return rr
});
</script>

<style scoped>

</style>
