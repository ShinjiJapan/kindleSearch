import { IDatePickerStrings, mergeStyleSets } from "@fluentui/react";
import { BindableBase } from "../../BindableBase";
import { getMonths, msg } from "../../utils/i18n";

export const controlClass = mergeStyleSets({
  control: {
    margin: "0 0 15px 0",
    maxWidth: "300px",
  },
});

function createDayPickerStrings(): IDatePickerStrings {
  const months = getMonths();
  return {
    months: months,
    shortMonths: months,
    days: [
      msg("daySunday"),
      msg("dayMonday"),
      msg("dayTuesday"),
      msg("dayWednesday"),
      msg("dayThursday"),
      msg("dayFriday"),
      msg("daySaturday"),
    ],
    shortDays: [
      msg("shortDaySun"),
      msg("shortDayMon"),
      msg("shortDayTue"),
      msg("shortDayWed"),
      msg("shortDayThu"),
      msg("shortDayFri"),
      msg("shortDaySat"),
    ],
    goToToday: msg("goToToday"),
    prevMonthAriaLabel: msg("prevMonthAriaLabel"),
    nextMonthAriaLabel: msg("nextMonthAriaLabel"),
    prevYearAriaLabel: msg("prevYearAriaLabel"),
    nextYearAriaLabel: msg("nextYearAriaLabel"),
    closeButtonAriaLabel: msg("closeDatePicker"),
  };
}

export default class TermVM extends BindableBase {
  public value: Date | undefined;
  public strings = createDayPickerStrings();
  public refreshStrings = (): void => {
    this.strings = createDayPickerStrings();
  };
  public formatDate = (date?: Date): string => {
    return date ? date.toLocaleDateString() : "";
  };
  public readonly allowTextInput = true;

  public onSelectDate = (date: Date | null | undefined): void => {
    this.value = date || undefined;
    this.onPropertyChanged();
  };
}
