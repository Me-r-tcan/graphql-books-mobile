import React, { useState } from 'react';
import { Button, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function App() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date: any) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  return (
    <View>
      <Button title="Tarih Seç" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={selectedDate}
      />
    </View>
  );
}
