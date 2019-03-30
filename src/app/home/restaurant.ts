

export class Restaurant {
    private name: string;
    private timming: any;
    constructor(name, timming) {
        this.name = name;
        this.timming = this.convertToWeekTimming(timming);
    }

    public getName(): string {
        return this.name;
    }

    public getTimming(): any {
        return this.timming;
    }

    public isOpen(dateTimeObj: Date): boolean {

        var time = this.getTime(dateTimeObj);
        var day = this.getDay(dateTimeObj);

        if (typeof this.timming[day] === 'undefined') { return false; }
        var open = this.timming[day].open;
        var close = this.timming[day].close;

        if (open < close && open <= time && time < close) {
            return true;
        } else if (open > close) {     // if it rolls over to the next day (e.g. 1800 - 0200)
            if ((open <= time && time <= 24) || (0 <= time && time < close)) {
                return true;
            }
        }
        return false;
    }

    private convertToWeekTimming(timming): any {

        let parsedTimming = {};

        let scheds = timming.split("/");
        let openAndClose;
        let days;

        for (let sched of scheds) {
            sched = sched.trim();


            openAndClose = this.parseTime(sched)
            days = this.parseDays(sched);


            for (let day of days) {
                parsedTimming[day] = {};
                parsedTimming[day].open = openAndClose[0];
                parsedTimming[day].close = openAndClose[1];
            }

        }

        return parsedTimming;

    }

    private parseTime(sched) {
        var hoursRegex = /\d*:*\d+ [ap]m - \d*:*\d+ [ap]m/;
        var openAndClose = sched.match(hoursRegex)[0].split(' - ');
        openAndClose[0] = this.to24Hr(openAndClose[0]);
        openAndClose[1] = this.to24Hr(openAndClose[1]);

        return openAndClose;
    }

    private parseDays(sched) {
        var openDays = [];     // array of days sharing the same schedule

        var dayRangeRegex = /[a-z]{3}-[a-z]{3}/i;
        if (sched.match(dayRangeRegex) && sched.match(dayRangeRegex).length > 0) {
            var dayRange = sched.match(dayRangeRegex)[0].split('-');
            openDays = this.rangeToDays(dayRange[0], dayRange[1]);
        }

        var singleDaysRegex = /([a-zA-Z]{3})/g;
        var singleDays = sched.match(singleDaysRegex);

        for (let day of singleDays) {
            openDays.push(day);
        }

        return openDays;

    }




    private to24Hr(time12) {
        var hoursRegex = /\d*/;
        var eveningRegex = /pm/i;

        var time = time12.split(':');
        var hours = parseInt(hoursRegex.exec(time[0])[0], 10);

        if (eveningRegex.test(time12) && hours < 12) {
            hours += 12;
        } else if (!eveningRegex.test(time12) && hours === 12) {
            if (!time[1] || parseInt(time[1], 10) === 0) {
                hours = 24;
            } else {
                hours -= 12;
            }
        }

        if (time[1]) {
            hours += parseInt(time[1], 10) / 60;
        }

        return hours;
    }


    private rangeToDays(startDay, endDay) {
        var week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        var days = [];

        var i, open = false;
        // loops twice just in case of a Sun-Thu schedule
        for (i = 0; i < week.length * 2; i++) {
            if (week[i % 7] === startDay) { open = true; }
            if (open) { days.push(week[i % 7]); }
            if (week[i % 7] === endDay && open === true) { break; }
        }

        return days;
    }

    private getTime(dateObj): any {

        let time: number = parseInt(dateObj.getHours(), 10);
        time = time + parseFloat((dateObj.getMinutes() / 60) + '');
        return time;
    }

    private getDay(dateObj): any {
        var weekday = {
            0: 'Sun',
            1: 'Mon',
            2: 'Tue',
            3: 'Wed',
            4: 'Thu',
            5: 'Fri',
            6: 'Sat'
        };

        var hour = parseInt(dateObj.getHours(), 10);
        var day = weekday[dateObj.getDay()];

        return day;
    }


}