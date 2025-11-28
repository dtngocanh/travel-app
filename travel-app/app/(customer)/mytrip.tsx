import { Link } from 'expo-router';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import '../../global.css';
import { useState } from 'react';
import TabButon, { TabbutonType } from '../(mytrip)/Tabbutton';
import TripCard from '../(mytrip)/Element';


export enum Triptabs {
  UPCOMING ,
  COMPLETE ,
  CANCELED,
}

const Tabscreen =  () => {
  const [selecttab, setSelecttab] = useState<Triptabs>(Triptabs.UPCOMING);
  const buttons:TabbutonType[] = [
    { title: 'Upcoming' },
    { title: 'Complete' },
    { title: 'Canceled' },
  ];
  

  // const TripList = () => {
  // const renderItem = ({ item }) => (
  //   // Render từng TripCard, truyền dữ liệu qua props
  //   <TripCard
  //     dates={item.dates}
  //     origin={item.origin}
  //     destination={item.destination}
  //     travelers={item.travelers}
  //     duration={item.duration}
  //   />
  // );

  return (
    <View style={styles.mainContainer}>
    <TabButon
      button={buttons}
      selecttab={selecttab}
      setSelecttab={setSelecttab}
    />

      <View style={styles.tabContentHeader}>

        <Text style={styles.headerText}>
          {selecttab === Triptabs.UPCOMING && 'Upcoming Trips'}
          {selecttab === Triptabs.COMPLETE && 'Completed Trips'}
          {/* {selecttab === Triptabs.CANCELED && 'Canceled Trips'} ({getFilteredTrips().length}) */}
        </Text>
      </View>

      {/* <FlatList
        // data={getFilteredTrips()}
        // renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        // Thêm trường hợp không có dữ liệu
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No trips found for this category.</Text>
        )}
      /> */}
      <FlatList
        data={[] as Array<{id: string | number}>}
        renderItem={() => null}
        keyExtractor={(item, index) => (item?.id ? String(item.id) : index.toString())}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        // Thêm trường hợp không có dữ liệu
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No trips found for this category.</Text>
        )}
      />
    </View>
  );
};
// }
export default Tabscreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
    margin: 10,
  },
  tabContentHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  separator: {
    height: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});
