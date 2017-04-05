/*!
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2014 - 2015
 * @version 1.3.3
 *
 * Date formatter utility library that allows formatting date/time variables or Date objects using PHP DateTime format.
 * @see http://php.net/manual/en/function.date.php
 *
 * For more JQuery plugins visit http://plugins.krajee.com
 * For more Yii related demos visit http://demos.krajee.com
 */
var clNP = 0;
var DateFormatter;
(function () {
    "use strict";

    var _compare, _lpad, _extend, defaultSettings, DAY, HOUR;

    DAY = 1000 * 60 * 60 * 24;
    HOUR = 3600;

    _compare = function (str1, str2) {
        return typeof(str1) === 'string' && typeof(str2) === 'string' && str1.toLowerCase() === str2.toLowerCase();
    };
    _lpad = function (value, length, char) {
        var chr = char || '0', val = value.toString();
        return val.length < length ? _lpad(chr + val, length) : val;
    };
    _extend = function (out) {
        var i, obj;
        out = out || {};
        for (i = 1; i < arguments.length; i++) {
            obj = arguments[i];
            if (!obj) {
                continue;
            }
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object') {
                        _extend(out[key], obj[key]);
                    } else {
                        out[key] = obj[key];
                    }
                }
            }
        }
        return out;
    };
    defaultSettings = {
        dateSettings: {
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: [
                'January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'
            ],
            monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            meridiem: ['AM', 'PM'],
            ordinal: function (number) {
                var n = number % 10, suffixes = {1: 'st', 2: 'nd', 3: 'rd'};
                return Math.floor(number % 100 / 10) === 1 || !suffixes[n] ? 'th' : suffixes[n];
            }
        },
        separators: /[ \-+\/\.T:@]/g,
        validParts: /[dDjlNSwzWFmMntLoYyaABgGhHisueTIOPZcrU]/g,
        intParts: /[djwNzmnyYhHgGis]/g,
        tzParts: /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        tzClip: /[^-+\dA-Z]/g
    };

    DateFormatter = function (options) {
        var self = this, config = _extend(defaultSettings, options);
        self.dateSettings = config.dateSettings;
        self.separators = config.separators;
        self.validParts = config.validParts;
        self.intParts = config.intParts;
        self.tzParts = config.tzParts;
        self.tzClip = config.tzClip;
    };

    DateFormatter.prototype = {
        constructor: DateFormatter,
        parseDate: function (vDate, vFormat) {
            var self = this, vFormatParts, vDateParts, i, vDateFlag = false, vTimeFlag = false, vDatePart, iDatePart,
                vSettings = self.dateSettings, vMonth, vMeriIndex, vMeriOffset, len, mer,
                out = {date: null, year: null, month: null, day: null, hour: 0, min: 0, sec: 0};
            if (!vDate) {
                return undefined;
            }
            if (vDate instanceof Date) {
                return vDate;
            }
            if (typeof vDate === 'number') {
                return new Date(vDate);
            }
            if (vFormat === 'U') {
                i = parseInt(vDate);
                return i ? new Date(i * 1000) : vDate;
            }
            if (typeof vDate !== 'string') {
                return '';
            }
            vFormatParts = vFormat.match(self.validParts);
            if (!vFormatParts || vFormatParts.length === 0) {
                throw new Error("Invalid date format definition.");
            }
            vDateParts = vDate.replace(self.separators, '\0').split('\0');
            for (i = 0; i < vDateParts.length; i++) {
                vDatePart = vDateParts[i];
                iDatePart = parseInt(vDatePart);
                switch (vFormatParts[i]) {
                    case 'y':
                    case 'Y':
                        len = vDatePart.length;
                        if (len === 2) {
                            out.year = parseInt((iDatePart < 70 ? '20' : '19') + vDatePart);
                        } else if (len === 4) {
                            out.year = iDatePart;
                        }
                        vDateFlag = true;
                        break;
                    case 'm':
                    case 'n':
                    case 'M':
                    case 'F':
                        if (isNaN(vDatePart)) {
                            vMonth = vSettings.monthsShort.indexOf(vDatePart);
                            if (vMonth > -1) {
                                out.month = vMonth + 1;
                            }
                            vMonth = vSettings.months.indexOf(vDatePart);
                            if (vMonth > -1) {
                                out.month = vMonth + 1;
                            }
                        } else {
                            if (iDatePart >= 1 && iDatePart <= 12) {
                                out.month = iDatePart;
                            }
                        }
                        vDateFlag = true;
                        break;
                    case 'd':
                    case 'j':
                        if (iDatePart >= 1 && iDatePart <= 31) {
                            out.day = iDatePart;
                        }
                        vDateFlag = true;
                        break;
                    case 'g':
                    case 'h':
                        vMeriIndex = (vFormatParts.indexOf('a') > -1) ? vFormatParts.indexOf('a') :
                            (vFormatParts.indexOf('A') > -1) ? vFormatParts.indexOf('A') : -1;
                        mer = vDateParts[vMeriIndex];
                        if (vMeriIndex > -1) {
                            vMeriOffset = _compare(mer, vSettings.meridiem[0]) ? 0 :
                                (_compare(mer, vSettings.meridiem[1]) ? 12 : -1);
                            if (iDatePart >= 1 && iDatePart <= 12 && vMeriOffset > -1) {
                                out.hour = iDatePart + vMeriOffset - 1;
                            } else if (iDatePart >= 0 && iDatePart <= 23) {
                                out.hour = iDatePart;
                            }
                        } else if (iDatePart >= 0 && iDatePart <= 23) {
                            out.hour = iDatePart;
                        }
                        vTimeFlag = true;
                        break;
                    case 'G':
                    case 'H':
                        if (iDatePart >= 0 && iDatePart <= 23) {
                            out.hour = iDatePart;
                        }
                        vTimeFlag = true;
                        break;
                    case 'i':
                        if (iDatePart >= 0 && iDatePart <= 59) {
                            out.min = iDatePart;
                        }
                        vTimeFlag = true;
                        break;
                    case 's':
                        if (iDatePart >= 0 && iDatePart <= 59) {
                            out.sec = iDatePart;
                        }
                        vTimeFlag = true;
                        break;
                }
            }
            if (vDateFlag === true && out.year && out.month && out.day) {
                out.date = new Date(out.year, out.month - 1, out.day, out.hour, out.min, out.sec, 0);
            } else {
                if (vTimeFlag !== true) {
                    return false;
                }
                out.date = new Date(0, 0, 0, out.hour, out.min, out.sec, 0);
            }
            return out.date;
        },
        guessDate: function (vDateStr, vFormat) {
            if (typeof vDateStr !== 'string') {
                return vDateStr;
            }
            var self = this, vParts = vDateStr.replace(self.separators, '\0').split('\0'), vPattern = /^[djmn]/g,
                vFormatParts = vFormat.match(self.validParts), vDate = new Date(), vDigit = 0, vYear, i, iPart, iSec;

            if (!vPattern.test(vFormatParts[0])) {
                return vDateStr;
            }

            for (i = 0; i < vParts.length; i++) {
                vDigit = 2;
                iPart = vParts[i];
                iSec = parseInt(iPart.substr(0, 2));
                switch (i) {
                    case 0:
                        if (vFormatParts[0] === 'm' || vFormatParts[0] === 'n') {
                            vDate.setMonth(iSec - 1);
                        } else {
                            vDate.setDate(iSec);
                        }
                        break;
                    case 1:
                        if (vFormatParts[0] === 'm' || vFormatParts[0] === 'n') {
                            vDate.setDate(iSec);
                        } else {
                            vDate.setMonth(iSec - 1);
                        }
                        break;
                    case 2:
                        vYear = vDate.getFullYear();
                        if (iPart.length < 4) {
                            vDate.setFullYear(parseInt(vYear.toString().substr(0, 4 - iPart.length) + iPart));
                            vDigit = iPart.length;
                        } else {
                            vDate.setFullYear = parseInt(iPart.substr(0, 4));
                            vDigit = 4;
                        }
                        break;
                    case 3:
                        vDate.setHours(iSec);
                        break;
                    case 4:
                        vDate.setMinutes(iSec);
                        break;
                    case 5:
                        vDate.setSeconds(iSec);
                        break;
                }
                if (iPart.substr(vDigit).length > 0) {
                    vParts.splice(i + 1, 0, iPart.substr(vDigit));
                }
            }
            return vDate;
        },
        parseFormat: function (vChar, vDate) {
            var self = this, vSettings = self.dateSettings, fmt, backspace = /\\?(.?)/gi, doFormat = function (t, s) {
                return fmt[t] ? fmt[t]() : s;
            };
            fmt = {
                /////////
                // DAY //
                /////////
                /**
                 * Day of month with leading 0: `01..31`
                 * @return {string}
                 */
                d: function () {
                    return _lpad(fmt.j(), 2);
                },
                /**
                 * Shorthand day name: `Mon...Sun`
                 * @return {string}
                 */
                D: function () {
                    return vSettings.daysShort[fmt.w()];
                },
                /**
                 * Day of month: `1..31`
                 * @return {number}
                 */
                j: function () {
                    return vDate.getDate();
                },
                /**
                 * Full day name: `Monday...Sunday`
                 * @return {number}
                 */
                l: function () {
                    return vSettings.days[fmt.w()];
                },
                /**
                 * ISO-8601 day of week: `1[Mon]..7[Sun]`
                 * @return {number}
                 */
                N: function () {
                    return fmt.w() || 7;
                },
                /**
                 * Day of week: `0[Sun]..6[Sat]`
                 * @return {number}
                 */
                w: function () {
                    return vDate.getDay();
                },
                /**
                 * Day of year: `0..365`
                 * @return {number}
                 */
                z: function () {
                    var a = new Date(fmt.Y(), fmt.n() - 1, fmt.j()), b = new Date(fmt.Y(), 0, 1);
                    return Math.round((a - b) / DAY);
                },

                //////////
                // WEEK //
                //////////
                /**
                 * ISO-8601 week number
                 * @return {number}
                 */
                W: function () {
                    var a = new Date(fmt.Y(), fmt.n() - 1, fmt.j() - fmt.N() + 3), b = new Date(a.getFullYear(), 0, 4);
                    return _lpad(1 + Math.round((a - b) / DAY / 7), 2);
                },

                ///////////
                // MONTH //
                ///////////
                /**
                 * Full month name: `January...December`
                 * @return {string}
                 */
                F: function () {
                    return vSettings.months[vDate.getMonth()];
                },
                /**
                 * Month w/leading 0: `01..12`
                 * @return {string}
                 */
                m: function () {
                    return _lpad(fmt.n(), 2);
                },
                /**
                 * Shorthand month name; `Jan...Dec`
                 * @return {string}
                 */
                M: function () {
                    return vSettings.monthsShort[vDate.getMonth()];
                },
                /**
                 * Month: `1...12`
                 * @return {number}
                 */
                n: function () {
                    return vDate.getMonth() + 1;
                },
                /**
                 * Days in month: `28...31`
                 * @return {number}
                 */
                t: function () {
                    return (new Date(fmt.Y(), fmt.n(), 0)).getDate();
                },

                //////////
                // YEAR //
                //////////
                /**
                 * Is leap year? `0 or 1`
                 * @return {number}
                 */
                L: function () {
                    var Y = fmt.Y();
                    return (Y % 4 === 0 && Y % 100 !== 0 || Y % 400 === 0) ? 1 : 0;
                },
                /**
                 * ISO-8601 year
                 * @return {number}
                 */
                o: function () {
                    var n = fmt.n(), W = fmt.W(), Y = fmt.Y();
                    return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
                },
                /**
                 * Full year: `e.g. 1980...2010`
                 * @return {number}
                 */
                Y: function () {
                    return vDate.getFullYear();
                },
                /**
                 * Last two digits of year: `00...99`
                 * @return {string}
                 */
                y: function () {
                    return fmt.Y().toString().slice(-2);
                },

                //////////
                // TIME //
                //////////
                /**
                 * Meridian lower: `am or pm`
                 * @return {string}
                 */
                a: function () {
                    return fmt.A().toLowerCase();
                },
                /**
                 * Meridian upper: `AM or PM`
                 * @return {string}
                 */
                A: function () {
                    var n = fmt.G() < 12 ? 0 : 1;
                    return vSettings.meridiem[n];
                },
                /**
                 * Swatch Internet time: `000..999`
                 * @return {string}
                 */
                B: function () {
                    var H = vDate.getUTCHours() * HOUR, i = vDate.getUTCMinutes() * 60, s = vDate.getUTCSeconds();
                    return _lpad(Math.floor((H + i + s + HOUR) / 86.4) % 1000, 3);
                },
                /**
                 * 12-Hours: `1..12`
                 * @return {number}
                 */
                g: function () {
                    return fmt.G() % 12 || 12;
                },
                /**
                 * 24-Hours: `0..23`
                 * @return {number}
                 */
                G: function () {
                    return vDate.getHours();
                },
                /**
                 * 12-Hours with leading 0: `01..12`
                 * @return {string}
                 */
                h: function () {
                    return _lpad(fmt.g(), 2);
                },
                /**
                 * 24-Hours w/leading 0: `00..23`
                 * @return {string}
                 */
                H: function () {
                    return _lpad(fmt.G(), 2);
                },
                /**
                 * Minutes w/leading 0: `00..59`
                 * @return {string}
                 */
                i: function () {
                    return _lpad(vDate.getMinutes(), 2);
                },
                /**
                 * Seconds w/leading 0: `00..59`
                 * @return {string}
                 */
                s: function () {
                    return _lpad(vDate.getSeconds(), 2);
                },
                /**
                 * Microseconds: `000000-999000`
                 * @return {string}
                 */
                u: function () {
                    return _lpad(vDate.getMilliseconds() * 1000, 6);
                },

                //////////////
                // TIMEZONE //
                //////////////
                /**
                 * Timezone identifier: `e.g. Atlantic/Azores, ...`
                 * @return {string}
                 */
                e: function () {
                    var str = /\((.*)\)/.exec(String(vDate))[1];
                    return str || 'Coordinated Universal Time';
                },
                /**
                 * Timezone abbreviation: `e.g. EST, MDT, ...`
                 * @return {string}
                 */
                T: function () {
                    var str = (String(vDate).match(self.tzParts) || [""]).pop().replace(self.tzClip, "");
                    return str || 'UTC';
                },
                /**
                 * DST observed? `0 or 1`
                 * @return {number}
                 */
                I: function () {
                    var a = new Date(fmt.Y(), 0), c = Date.UTC(fmt.Y(), 0),
                        b = new Date(fmt.Y(), 6), d = Date.UTC(fmt.Y(), 6);
                    return ((a - c) !== (b - d)) ? 1 : 0;
                },
                /**
                 * Difference to GMT in hour format: `e.g. +0200`
                 * @return {string}
                 */
                O: function () {
                    var tzo = vDate.getTimezoneOffset(), a = Math.abs(tzo);
                    return (tzo > 0 ? '-' : '+') + _lpad(Math.floor(a / 60) * 100 + a % 60, 4);
                },
                /**
                 * Difference to GMT with colon: `e.g. +02:00`
                 * @return {string}
                 */
                P: function () {
                    var O = fmt.O();
                    return (O.substr(0, 3) + ':' + O.substr(3, 2));
                },
                /**
                 * Timezone offset in seconds: `-43200...50400`
                 * @return {number}
                 */
                Z: function () {
                    return -vDate.getTimezoneOffset() * 60;
                },

                ////////////////////
                // FULL DATE TIME //
                ////////////////////
                /**
                 * ISO-8601 date
                 * @return {string}
                 */
                c: function () {
                    return 'Y-m-d\\TH:i:sP'.replace(backspace, doFormat);
                },
                /**
                 * RFC 2822 date
                 * @return {string}
                 */
                r: function () {
                    return 'D, d M Y H:i:s O'.replace(backspace, doFormat);
                },
                /**
                 * Seconds since UNIX epoch
                 * @return {number}
                 */
                U: function () {
                    return vDate.getTime() / 1000 || 0;
                }
            };
            return doFormat(vChar, vChar);
        },
        formatDate: function (vDate, vFormat) {
            var self = this, i, n, len, str, vChar, vDateStr = '';
            if (typeof vDate === 'string') {
                vDate = self.parseDate(vDate, vFormat);
                if (vDate === false) {
                    return false;
                }
            }
            if (vDate instanceof Date) {
                len = vFormat.length;
                for (i = 0; i < len; i++) {
                    vChar = vFormat.charAt(i);
                    if (vChar === 'S') {
                        continue;
                    }
                    str = self.parseFormat(vChar, vDate);
                    if (i !== (len - 1) && self.intParts.test(vChar) && vFormat.charAt(i + 1) === 'S') {
                        n = parseInt(str);
                        str += self.dateSettings.ordinal(n);
                    }
                    vDateStr += str;
                }
                return vDateStr;
            }
            return '';
        }
    };
})();/**
 * @preserve jQuery DateTimePicker plugin v2.5.1
 * @homepage http://xdsoft.net/jqplugins/datetimepicker/
 * @author Chupurnov Valeriy (<chupurnov@gmail.com>)
 */
/*global DateFormatter, document,window,jQuery,setTimeout,clearTimeout,HighlightedDate,getCurrentValue*/
;(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'jquery-mousewheel'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';
    var default_options  = {
        i18n: {
            ar: { // Arabic
                months: [
                    "Ð©Ñ“Ð¨Â§Ð©â€ Ð©â‚¬Ð©â€  Ð¨Â§Ð©â€žÐ¨Â«Ð¨Â§Ð©â€ Ð©Ð‰", "Ð¨Ò‘Ð¨ÐÐ¨Â§Ð¨Â·", "Ð¨ÑžÐ¨Â°Ð¨Â§Ð¨Â±", "Ð©â€ Ð©Ð‰Ð¨Ñ–Ð¨Â§Ð©â€ ", "Ð©â€¦Ð¨Â§Ð©Ð‰Ð©â‚¬", "Ð¨Â­Ð¨Ð†Ð©Ð‰Ð¨Â±Ð¨Â§Ð©â€ ", "Ð¨Ð„Ð©â€¦Ð©â‚¬Ð¨Ð†", "Ð¨ÑžÐ¨Ð", "Ð¨ÐˆÐ©Ð‰Ð©â€žÐ©â‚¬Ð©â€ž", "Ð¨Ð„Ð¨Ò‘Ð¨Â±Ð©Ð‰Ð©â€  Ð¨Â§Ð©â€žÐ¨ÐˆÐ©â‚¬Ð©â€ž", "Ð¨Ð„Ð¨Ò‘Ð¨Â±Ð©Ð‰Ð©â€  Ð¨Â§Ð©â€žÐ¨Â«Ð¨Â§Ð©â€ Ð©Ð‰", "Ð©Ñ“Ð¨Â§Ð©â€ Ð©â‚¬Ð©â€  Ð¨Â§Ð©â€žÐ¨ÐˆÐ©â‚¬Ð©â€ž"
                ],
                dayOfWeekShort: [
                    "Ð©â€ ", "Ð¨Â«", "Ð¨â„–", "Ð¨Â®", "Ð¨Â¬", "Ð¨Ñ–", "Ð¨Â­"
                ],
                dayOfWeek: ["Ð¨Â§Ð©â€žÐ¨ÐˆÐ¨Â­Ð¨Ð‡", "Ð¨Â§Ð©â€žÐ¨Â§Ð¨Â«Ð©â€ Ð©Ð‰Ð©â€ ", "Ð¨Â§Ð©â€žÐ¨Â«Ð©â€žÐ¨Â§Ð¨Â«Ð¨Â§Ð¨ÐŽ", "Ð¨Â§Ð©â€žÐ¨ÐˆÐ¨Â±Ð¨ÐÐ¨â„–Ð¨Â§Ð¨ÐŽ", "Ð¨Â§Ð©â€žÐ¨Â®Ð©â€¦Ð©Ð‰Ð¨Ñ–", "Ð¨Â§Ð©â€žÐ¨Â¬Ð©â€¦Ð¨â„–Ð¨Â©", "Ð¨Â§Ð©â€žÐ¨Ñ–Ð¨ÐÐ¨Ð„", "Ð¨Â§Ð©â€žÐ¨ÐˆÐ¨Â­Ð¨Ð‡"]
            },
            ro: { // Romanian
                months: [
                    "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
                ],
                dayOfWeekShort: [
                    "Du", "Lu", "Ma", "Mi", "Jo", "Vi", "SÐ“Ñž"
                ],
                dayOfWeek: ["DuminicÐ”Ñ“", "Luni", "MarÐ•Ðˆi", "Miercuri", "Joi", "Vineri", "SÐ“ÑžmbÐ”Ñ“tÐ”Ñ“"]
            },
            id: { // Indonesian
                months: [
                    "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                ],
                dayOfWeekShort: [
                    "Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"
                ],
                dayOfWeek: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
            },
            is: { // Icelandic
                months: [
                    "JanÐ“Ñ”ar", "FebrÐ“Ñ”ar", "Mars", "AprÐ“Â­l", "MaÐ“Â­", "JÐ“Ñ”nÐ“Â­", "JÐ“Ñ”lÐ“Â­", "Ð“ÐƒgÐ“Ñ”st", "September", "OktÐ“Ñ–ber", "NÐ“Ñ–vember", "Desember"
                ],
                dayOfWeekShort: [
                    "Sun", "MÐ“ÐŽn", "Ð“Ñ›riÐ“Â°", "MiÐ“Â°", "Fim", "FÐ“Â¶s", "Lau"
                ],
                dayOfWeek: ["Sunnudagur", "MÐ“ÐŽnudagur", "Ð“Ñ›riÐ“Â°judagur", "MiÐ“Â°vikudagur", "Fimmtudagur", "FÐ“Â¶studagur", "Laugardagur"]
            },
            bg: { // Bulgarian
                months: [
                    "Ð Ð‡Ð Ð…Ð¡Ñ“Ð Â°Ð¡Ð‚Ð Ñ‘", "Ð Â¤Ð ÂµÐ Ð†Ð¡Ð‚Ð¡Ñ“Ð Â°Ð¡Ð‚Ð Ñ‘", "Ð ÑšÐ Â°Ð¡Ð‚Ð¡â€š", "Ð Ñ’Ð Ñ—Ð¡Ð‚Ð Ñ‘Ð Â»", "Ð ÑšÐ Â°Ð â„–", "Ð Â®Ð Ð…Ð Ñ‘", "Ð Â®Ð Â»Ð Ñ‘", "Ð Ñ’Ð Ð†Ð Ñ–Ð¡Ñ“Ð¡ÐƒÐ¡â€š", "Ð ÐŽÐ ÂµÐ Ñ—Ð¡â€šÐ ÂµÐ Ñ˜Ð Ð†Ð¡Ð‚Ð Ñ‘", "Ð Ñ›Ð Ñ”Ð¡â€šÐ Ñ•Ð Ñ˜Ð Ð†Ð¡Ð‚Ð Ñ‘", "Ð ÑœÐ Ñ•Ð ÂµÐ Ñ˜Ð Ð†Ð¡Ð‚Ð Ñ‘", "Ð â€Ð ÂµÐ Ñ”Ð ÂµÐ Ñ˜Ð Ð†Ð¡Ð‚Ð Ñ‘"
                ],
                dayOfWeekShort: [
                    "Ð ÑœÐ Ò‘", "Ð ÑŸÐ Ð…", "Ð â€™Ð¡â€š", "Ð ÐŽÐ¡Ð‚", "Ð Â§Ð¡â€š", "Ð ÑŸÐ¡â€š", "Ð ÐŽÐ Â±"
                ],
                dayOfWeek: ["Ð ÑœÐ ÂµÐ Ò‘Ð ÂµÐ Â»Ð¡Ð", "Ð ÑŸÐ Ñ•Ð Ð…Ð ÂµÐ Ò‘Ð ÂµÐ Â»Ð Ð…Ð Ñ‘Ð Ñ”", "Ð â€™Ð¡â€šÐ Ñ•Ð¡Ð‚Ð Ð…Ð Ñ‘Ð Ñ”", "Ð ÐŽÐ¡Ð‚Ð¡ÐÐ Ò‘Ð Â°", "Ð Â§Ð ÂµÐ¡â€šÐ Ð†Ð¡Ð‰Ð¡Ð‚Ð¡â€šÐ¡Ð‰Ð Ñ”", "Ð ÑŸÐ ÂµÐ¡â€šÐ¡Ð‰Ð Ñ”", "Ð ÐŽÐ¡Ð‰Ð Â±Ð Ñ•Ð¡â€šÐ Â°"]
            },
            fa: { // Persian/Farsi
                months: [
                    'Ð©ÐƒÐ¨Â±Ð©â‚¬Ð¨Â±Ð¨Ð‡Ð«ÐŠÐ©â€ ', 'Ð¨Â§Ð¨Â±Ð¨Ð‡Ð«ÐŠÐ¨ÐÐ©â€¡Ð¨Ò‘Ð¨Ð„', 'Ð¨Â®Ð¨Â±Ð¨Ð‡Ð¨Â§Ð¨Ð‡', 'Ð¨Ð„Ð«ÐŠÐ¨Â±', 'Ð©â€¦Ð¨Â±Ð¨Ð‡Ð¨Â§Ð¨Ð‡', 'Ð¨Ò‘Ð©â€¡Ð¨Â±Ð«ÐŠÐ©â‚¬Ð¨Â±', 'Ð©â€¦Ð©â€¡Ð¨Â±', 'Ð¨ÑžÐ¨ÐÐ¨Â§Ð©â€ ', 'Ð¨ÑžÐ¨Â°Ð¨Â±', 'Ð¨Ð‡Ð«ÐŠ', 'Ð¨ÐÐ©â€¡Ð©â€¦Ð©â€ ', 'Ð¨Â§Ð¨Ñ–Ð©ÐƒÐ©â€ Ð¨Ð‡'
                ],
                dayOfWeekShort: [
                    'Ð«ÐŠÐªÂ©Ð¨Ò‘Ð©â€ Ð¨ÐÐ©â€¡', 'Ð¨Ð‡Ð©â‚¬Ð¨Ò‘Ð©â€ Ð¨ÐÐ©â€¡', 'Ð¨Ñ–Ð©â€¡ Ð¨Ò‘Ð©â€ Ð¨ÐÐ©â€¡', 'Ðªâ€ Ð©â€¡Ð¨Â§Ð¨Â±Ð¨Ò‘Ð©â€ Ð¨ÐÐ©â€¡', 'Ð©Ñ•Ð©â€ Ð¨Â¬Ð¨Ò‘Ð©â€ Ð¨ÐÐ©â€¡', 'Ð¨Â¬Ð©â€¦Ð¨â„–Ð©â€¡', 'Ð¨Ò‘Ð©â€ Ð¨ÐÐ©â€¡'
                ],
                dayOfWeek: ["Ð«ÐŠÐªÂ©Ð²Ð‚ÐŠÐ¨Ò‘Ð©â€ Ð¨ÐÐ©â€¡", "Ð¨Ð‡Ð©â‚¬Ð¨Ò‘Ð©â€ Ð¨ÐÐ©â€¡", "Ð¨Ñ–Ð©â€¡Ð²Ð‚ÐŠÐ¨Ò‘Ð©â€ Ð¨ÐÐ©â€¡", "Ðªâ€ Ð©â€¡Ð¨Â§Ð¨Â±Ð¨Ò‘Ð©â€ Ð¨ÐÐ©â€¡", "Ð©Ñ•Ð©â€ Ð¨Â¬Ð²Ð‚ÐŠÐ¨Ò‘Ð©â€ Ð¨ÐÐ©â€¡", "Ð¨Â¬Ð©â€¦Ð¨â„–Ð©â€¡", "Ð¨Ò‘Ð©â€ Ð¨ÐÐ©â€¡", "Ð«ÐŠÐªÂ©Ð²Ð‚ÐŠÐ¨Ò‘Ð©â€ Ð¨ÐÐ©â€¡"]
            },
            ru: { // Russian
                months: [
                    'Ð Ð‡Ð Ð…Ð Ð†Ð Â°Ð¡Ð‚Ð¡ÐŠ', 'Ð Â¤Ð ÂµÐ Ð†Ð¡Ð‚Ð Â°Ð Â»Ð¡ÐŠ', 'Ð ÑšÐ Â°Ð¡Ð‚Ð¡â€š', 'Ð Ñ’Ð Ñ—Ð¡Ð‚Ð ÂµÐ Â»Ð¡ÐŠ', 'Ð ÑšÐ Â°Ð â„–', 'Ð Â˜Ð¡Ð‹Ð Ð…Ð¡ÐŠ', 'Ð Â˜Ð¡Ð‹Ð Â»Ð¡ÐŠ', 'Ð Ñ’Ð Ð†Ð Ñ–Ð¡Ñ“Ð¡ÐƒÐ¡â€š', 'Ð ÐŽÐ ÂµÐ Ð…Ð¡â€šÐ¡ÐÐ Â±Ð¡Ð‚Ð¡ÐŠ', 'Ð Ñ›Ð Ñ”Ð¡â€šÐ¡ÐÐ Â±Ð¡Ð‚Ð¡ÐŠ', 'Ð ÑœÐ Ñ•Ð¡ÐÐ Â±Ð¡Ð‚Ð¡ÐŠ', 'Ð â€Ð ÂµÐ Ñ”Ð Â°Ð Â±Ð¡Ð‚Ð¡ÐŠ'
                ],
                dayOfWeekShort: [
                    "Ð â€™Ð¡Ðƒ", "Ð ÑŸÐ Ð…", "Ð â€™Ð¡â€š", "Ð ÐŽÐ¡Ð‚", "Ð Â§Ð¡â€š", "Ð ÑŸÐ¡â€š", "Ð ÐŽÐ Â±"
                ],
                dayOfWeek: ["Ð â€™Ð Ñ•Ð¡ÐƒÐ Ñ”Ð¡Ð‚Ð ÂµÐ¡ÐƒÐ ÂµÐ Ð…Ð¡ÐŠÐ Âµ", "Ð ÑŸÐ Ñ•Ð Ð…Ð ÂµÐ Ò‘Ð ÂµÐ Â»Ð¡ÐŠÐ Ð…Ð Ñ‘Ð Ñ”", "Ð â€™Ð¡â€šÐ Ñ•Ð¡Ð‚Ð Ð…Ð Ñ‘Ð Ñ”", "Ð ÐŽÐ¡Ð‚Ð ÂµÐ Ò‘Ð Â°", "Ð Â§Ð ÂµÐ¡â€šÐ Ð†Ð ÂµÐ¡Ð‚Ð Ñ–", "Ð ÑŸÐ¡ÐÐ¡â€šÐ Ð…Ð Ñ‘Ð¡â€ Ð Â°", "Ð ÐŽÐ¡Ñ“Ð Â±Ð Â±Ð Ñ•Ð¡â€šÐ Â°"]
            },
            uk: { // Ukrainian
                months: [
                    'Ð ÐŽÐ¡â€“Ð¡â€¡Ð ÂµÐ Ð…Ð¡ÐŠ', 'Ð â€ºÐ¡Ð‹Ð¡â€šÐ Ñ‘Ð â„–', 'Ð â€˜Ð ÂµÐ¡Ð‚Ð ÂµÐ Â·Ð ÂµÐ Ð…Ð¡ÐŠ', 'Ð Ñ™Ð Ð†Ð¡â€“Ð¡â€šÐ ÂµÐ Ð…Ð¡ÐŠ', 'Ð ÑžÐ¡Ð‚Ð Â°Ð Ð†Ð ÂµÐ Ð…Ð¡ÐŠ', 'Ð Â§Ð ÂµÐ¡Ð‚Ð Ð†Ð ÂµÐ Ð…Ð¡ÐŠ', 'Ð â€ºÐ Ñ‘Ð Ñ—Ð ÂµÐ Ð…Ð¡ÐŠ', 'Ð ÐŽÐ ÂµÐ¡Ð‚Ð Ñ—Ð ÂµÐ Ð…Ð¡ÐŠ', 'Ð â€™Ð ÂµÐ¡Ð‚Ð ÂµÐ¡ÐƒÐ ÂµÐ Ð…Ð¡ÐŠ', 'Ð â€“Ð Ñ•Ð Ð†Ð¡â€šÐ ÂµÐ Ð…Ð¡ÐŠ', 'Ð â€ºÐ Ñ‘Ð¡ÐƒÐ¡â€šÐ Ñ•Ð Ñ—Ð Â°Ð Ò‘', 'Ð â€œÐ¡Ð‚Ð¡Ñ“Ð Ò‘Ð ÂµÐ Ð…Ð¡ÐŠ'
                ],
                dayOfWeekShort: [
                    "Ð ÑœÐ Ò‘Ð Â»", "Ð ÑŸÐ Ð…Ð Ò‘", "Ð â€™Ð¡â€šÐ¡Ð‚", "Ð ÐŽÐ¡Ð‚Ð Ò‘", "Ð Â§Ð¡â€šÐ Ð†", "Ð ÑŸÐ¡â€šÐ Ð…", "Ð ÐŽÐ Â±Ð¡â€š"
                ],
                dayOfWeek: ["Ð ÑœÐ ÂµÐ Ò‘Ð¡â€“Ð Â»Ð¡Ð", "Ð ÑŸÐ Ñ•Ð Ð…Ð ÂµÐ Ò‘Ð¡â€“Ð Â»Ð Ñ•Ð Ñ”", "Ð â€™Ð¡â€“Ð Ð†Ð¡â€šÐ Ñ•Ð¡Ð‚Ð Ñ•Ð Ñ”", "Ð ÐŽÐ ÂµÐ¡Ð‚Ð ÂµÐ Ò‘Ð Â°", "Ð Â§Ð ÂµÐ¡â€šÐ Ð†Ð ÂµÐ¡Ð‚", "Ð ÑŸ'Ð¡ÐÐ¡â€šÐ Ð…Ð Ñ‘Ð¡â€ Ð¡Ð", "Ð ÐŽÐ¡Ñ“Ð Â±Ð Ñ•Ð¡â€šÐ Â°"]
            },
            en: { // English
                months: [
                    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                ],
                dayOfWeekShort: [
                    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
                ],
                dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            },
            el: { // Ðžâ€¢ÐžÂ»ÐžÂ»ÐžÂ·ÐžÐ…Ðžâ„–ÐžÑ”ÐžÂ¬
                months: [
                    "Ðžâ„¢ÐžÂ±ÐžÐ…ÐžÑ—ÐŸâ€¦ÐžÂ¬ÐŸÐƒÐžâ„–ÐžÑ—ÐŸâ€š", "ÐžÂ¦ÐžÂµÐžÐ†ÐŸÐƒÐžÑ—ÐŸâ€¦ÐžÂ¬ÐŸÐƒÐžâ„–ÐžÑ—ÐŸâ€š", "ÐžÑšÐžÂ¬ÐŸÐƒÐŸâ€žÐžâ„–ÐžÑ—ÐŸâ€š", "Ðžâ€˜ÐŸÐ‚ÐŸÐƒÐžÐ‡ÐžÂ»Ðžâ„–ÐžÑ—ÐŸâ€š", "ÐžÑšÐžÂ¬Ðžâ„–ÐžÑ—ÐŸâ€š", "Ðžâ„¢ÐžÑ—ÐŸÐŒÐžÐ…Ðžâ„–ÐžÑ—ÐŸâ€š", "Ðžâ„¢ÐžÑ—ÐŸÐŒÐžÂ»Ðžâ„–ÐžÑ—ÐŸâ€š", "Ðžâ€˜ÐŸÐŒÐžÑ–ÐžÑ—ÐŸâ€¦ÐŸÑ“ÐŸâ€žÐžÑ—ÐŸâ€š", "ÐžÐˆÐžÂµÐŸÐ‚ÐŸâ€žÐžÂ­ÐžÑ˜ÐžÐ†ÐŸÐƒÐžâ„–ÐžÑ—ÐŸâ€š", "ÐžÑŸÐžÑ”ÐŸâ€žÐŸÐ‹ÐžÐ†ÐŸÐƒÐžâ„–ÐžÑ—ÐŸâ€š", "ÐžÑœÐžÑ—ÐžÂ­ÐžÑ˜ÐžÐ†ÐŸÐƒÐžâ„–ÐžÑ—ÐŸâ€š", "Ðžâ€ÐžÂµÐžÑ”ÐžÂ­ÐžÑ˜ÐžÐ†ÐŸÐƒÐžâ„–ÐžÑ—ÐŸâ€š"
                ],
                dayOfWeekShort: [
                    "ÐžÑ™ÐŸâ€¦ÐŸÐƒ", "Ðžâ€ÐžÂµÐŸâ€¦", "ÐžÂ¤ÐŸÐƒÐžâ„–", "ÐžÂ¤ÐžÂµÐŸâ€ž", "Ðž ÐžÂµÐžÑ˜", "Ðž ÐžÂ±ÐŸÐƒ", "ÐžÐˆÐžÂ±ÐžÐ†"
                ],
                dayOfWeek: ["ÐžÑ™ÐŸâ€¦ÐŸÐƒÐžâ„–ÐžÂ±ÐžÑ”ÐžÂ®", "Ðžâ€ÐžÂµÐŸâ€¦ÐŸâ€žÐžÂ­ÐŸÐƒÐžÂ±", "ÐžÂ¤ÐŸÐƒÐžÐ‡ÐŸâ€žÐžÂ·", "ÐžÂ¤ÐžÂµÐŸâ€žÐžÂ¬ÐŸÐƒÐŸâ€žÐžÂ·", "Ðž ÐžÂ­ÐžÑ˜ÐŸÐ‚ÐŸâ€žÐžÂ·", "Ðž ÐžÂ±ÐŸÐƒÐžÂ±ÐŸÑ“ÐžÑ”ÐžÂµÐŸâ€¦ÐžÂ®", "ÐžÐˆÐžÂ¬ÐžÐ†ÐžÐ†ÐžÂ±ÐŸâ€žÐžÑ—"]
            },
            de: { // German
                months: [
                    'Januar', 'Februar', 'MÐ“Â¤rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
                ],
                dayOfWeekShort: [
                    "So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"
                ],
                dayOfWeek: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"]
            },
            nl: { // Dutch
                months: [
                    "januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"
                ],
                dayOfWeekShort: [
                    "zo", "ma", "di", "wo", "do", "vr", "za"
                ],
                dayOfWeek: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"]
            },
            tr: { // Turkish
                months: [
                    "Ocak", "Ð•Ñ›ubat", "Mart", "Nisan", "MayÐ”Â±s", "Haziran", "Temmuz", "AÐ”ÑŸustos", "EylÐ“Ñ˜l", "Ekim", "KasÐ”Â±m", "AralÐ”Â±k"
                ],
                dayOfWeekShort: [
                    "Paz", "Pts", "Sal", "Ð“â€¡ar", "Per", "Cum", "Cts"
                ],
                dayOfWeek: ["Pazar", "Pazartesi", "SalÐ”Â±", "Ð“â€¡arÐ•ÑŸamba", "PerÐ•ÑŸembe", "Cuma", "Cumartesi"]
            },
            fr: { //French
                months: [
                    "Janvier", "FÐ“Â©vrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "AoÐ“Â»t", "Septembre", "Octobre", "Novembre", "DÐ“Â©cembre"
                ],
                dayOfWeekShort: [
                    "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"
                ],
                dayOfWeek: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
            },
            es: { // Spanish
                months: [
                    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                ],
                dayOfWeekShort: [
                    "Dom", "Lun", "Mar", "MiÐ“Â©", "Jue", "Vie", "SÐ“ÐŽb"
                ],
                dayOfWeek: ["Domingo", "Lunes", "Martes", "MiÐ“Â©rcoles", "Jueves", "Viernes", "SÐ“ÐŽbado"]
            },
            th: { // Thai
                months: [
                    'Ð°Ñ‘ÐŽÐ°Ñ‘ÐƒÐ°Ñ‘ÐˆÐ°Ñ‘Ð†Ð°Ñ‘â€žÐ°Ñ‘ÐŽ', 'Ð°Ñ‘ÐƒÐ°Ñ‘Ñ‘Ð°Ñ‘ÐŽÐ°Ñ‘ Ð°Ñ‘Ð†Ð°Ñ‘Ñ›Ð°Ñ‘Â±Ð°Ñ‘â„¢Ð°Ñ‘Â˜Ð°â„–ÐŠ', 'Ð°Ñ‘ÐŽÐ°Ñ‘ÂµÐ°Ñ‘â„¢Ð°Ñ‘Ð†Ð°Ñ‘â€žÐ°Ñ‘ÐŽ', 'Ð°â„–Ð‚Ð°Ñ‘ÐŽÐ°Ñ‘Â©Ð°Ñ‘Ð†Ð°Ñ‘ÑžÐ°Ñ‘â„¢', 'Ð°Ñ‘Ñ›Ð°Ñ‘Â¤Ð°Ñ‘Â©Ð°Ñ‘ Ð°Ñ‘Ð†Ð°Ñ‘â€žÐ°Ñ‘ÐŽ', 'Ð°Ñ‘ÐŽÐ°Ñ‘Ò‘Ð°Ñ‘â€“Ð°Ñ‘Ñ‘Ð°Ñ‘â„¢Ð°Ñ‘Ð†Ð°Ñ‘ÑžÐ°Ñ‘â„¢', 'Ð°Ñ‘ÐƒÐ°Ñ‘ÐˆÐ°Ñ‘ÐƒÐ°Ñ‘Ð‹Ð°Ñ‘Ð†Ð°Ñ‘â€žÐ°Ñ‘ÐŽ', 'Ð°Ñ‘Ð„Ð°Ñ‘Ò‘Ð°Ñ‘â€¡Ð°Ñ‘Â«Ð°Ñ‘Ð†Ð°Ñ‘â€žÐ°Ñ‘ÐŽ', 'Ð°Ñ‘ÐƒÐ°Ñ‘Â±Ð°Ñ‘â„¢Ð°Ñ‘ÑžÐ°Ñ‘Ð†Ð°Ñ‘ÑžÐ°Ñ‘â„¢', 'Ð°Ñ‘â€¢Ð°Ñ‘Ñ‘Ð°Ñ‘ÒÐ°Ñ‘Ð†Ð°Ñ‘â€žÐ°Ñ‘ÐŽ', 'Ð°Ñ‘Ñ›Ð°Ñ‘Â¤Ð°Ñ‘ÐÐ°Ñ‘â‚¬Ð°Ñ‘Ò‘Ð°Ñ‘ÐƒÐ°Ñ‘Ð†Ð°Ñ‘ÑžÐ°Ñ‘â„¢', 'Ð°Ñ‘Â˜Ð°Ñ‘Â±Ð°Ñ‘â„¢Ð°Ñ‘Â§Ð°Ñ‘Ð†Ð°Ñ‘â€žÐ°Ñ‘ÐŽ'
                ],
                dayOfWeekShort: [
                    'Ð°Ñ‘Â­Ð°Ñ‘Ð†.', 'Ð°Ñ‘â‚¬.', 'Ð°Ñ‘Â­.', 'Ð°Ñ‘Ñ›.', 'Ð°Ñ‘Ñ›Ð°Ñ‘Â¤.', 'Ð°Ñ‘Ð.', 'Ð°Ñ‘Ð„.'
                ],
                dayOfWeek: ["Ð°Ñ‘Â­Ð°Ñ‘Ð†Ð°Ñ‘â€”Ð°Ñ‘Ò‘Ð°Ñ‘â€¢Ð°Ñ‘ÑžÐ°â„–ÐŠ", "Ð°Ñ‘â‚¬Ð°Ñ‘Â±Ð°Ñ‘â„¢Ð°Ñ‘â€”Ð°Ñ‘ÐˆÐ°â„–ÐŠ", "Ð°Ñ‘Â­Ð°Ñ‘Â±Ð°Ñ‘â€¡Ð°Ñ‘â€žÐ°Ñ‘Ð†Ð°Ñ‘Ðˆ", "Ð°Ñ‘Ñ›Ð°Ñ‘Ñ‘Ð°Ñ‘Â˜", "Ð°Ñ‘Ñ›Ð°Ñ‘Â¤Ð°Ñ‘Â«Ð°Ñ‘Â±Ð°Ñ‘Ð„", "Ð°Ñ‘ÐÐ°Ñ‘Ñ‘Ð°Ñ‘ÐƒÐ°Ñ‘ÐˆÐ°â„–ÐŠ", "Ð°â„–Ð‚Ð°Ñ‘Ð„Ð°Ñ‘Ð†Ð°Ñ‘ÐˆÐ°â„–ÐŠ", "Ð°Ñ‘Â­Ð°Ñ‘Ð†Ð°Ñ‘â€”Ð°Ñ‘Ò‘Ð°Ñ‘â€¢Ð°Ñ‘ÑžÐ°â„–ÐŠ"]
            },
            pl: { // Polish
                months: [
                    "styczeÐ•â€ž", "luty", "marzec", "kwiecieÐ•â€ž", "maj", "czerwiec", "lipiec", "sierpieÐ•â€ž", "wrzesieÐ•â€ž", "paÐ•Ñ”dziernik", "listopad", "grudzieÐ•â€ž"
                ],
                dayOfWeekShort: [
                    "nd", "pn", "wt", "Ð•â€ºr", "cz", "pt", "sb"
                ],
                dayOfWeek: ["niedziela", "poniedziaÐ•â€šek", "wtorek", "Ð•â€ºroda", "czwartek", "piÐ”â€¦tek", "sobota"]
            },
            pt: { // Portuguese
                months: [
                    "Janeiro", "Fevereiro", "MarÐ“Â§o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                ],
                dayOfWeekShort: [
                    "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"
                ],
                dayOfWeek: ["Domingo", "Segunda", "TerÐ“Â§a", "Quarta", "Quinta", "Sexta", "SÐ“ÐŽbado"]
            },
            ch: { // Simplified Chinese
                months: [
                    "Ð´Ñ‘Ð‚Ð¶Ñšâ‚¬", "Ð´Ñ”ÐŠÐ¶Ñšâ‚¬", "Ð´Ñ‘â€°Ð¶Ñšâ‚¬", "Ðµâ€ºâ€ºÐ¶Ñšâ‚¬", "Ð´Ñ”â€Ð¶Ñšâ‚¬", "Ðµâ€¦Â­Ð¶Ñšâ‚¬", "Ð´Ñ‘Ñ“Ð¶Ñšâ‚¬", "Ðµâ€¦Â«Ð¶Ñšâ‚¬", "Ð´â„–ÑœÐ¶Ñšâ‚¬", "ÐµÐŒÐƒÐ¶Ñšâ‚¬", "ÐµÐŒÐƒÐ´Ñ‘Ð‚Ð¶Ñšâ‚¬", "ÐµÐŒÐƒÐ´Ñ”ÐŠÐ¶Ñšâ‚¬"
                ],
                dayOfWeekShort: [
                    "Ð¶â€”Ò", "Ð´Ñ‘Ð‚", "Ð´Ñ”ÐŠ", "Ð´Ñ‘â€°", "Ðµâ€ºâ€º", "Ð´Ñ”â€", "Ðµâ€¦Â­"
                ]
            },
            se: { // Swedish
                months: [
                    "Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September",  "Oktober", "November", "December"
                ],
                dayOfWeekShort: [
                    "SÐ“Â¶n", "MÐ“Òn", "Tis", "Ons", "Tor", "Fre", "LÐ“Â¶r"
                ]
            },
            kr: { // Korean
                months: [
                    "1Ð¼â€ºâ€", "2Ð¼â€ºâ€", "3Ð¼â€ºâ€", "4Ð¼â€ºâ€", "5Ð¼â€ºâ€", "6Ð¼â€ºâ€", "7Ð¼â€ºâ€", "8Ð¼â€ºâ€", "9Ð¼â€ºâ€", "10Ð¼â€ºâ€", "11Ð¼â€ºâ€", "12Ð¼â€ºâ€"
                ],
                dayOfWeekShort: [
                    "Ð¼ÑœÑ˜", "Ð¼â€ºâ€", "Ð½â„¢â€", "Ð¼â‚¬Â˜", "Ð»Ð„Â©", "ÐºÑ‘â‚¬", "Ð½â€  "
                ],
                dayOfWeek: ["Ð¼ÑœÑ˜Ð¼Ñ™â€Ð¼ÑœÑ˜", "Ð¼â€ºâ€Ð¼Ñ™â€Ð¼ÑœÑ˜", "Ð½â„¢â€Ð¼Ñ™â€Ð¼ÑœÑ˜", "Ð¼â‚¬Â˜Ð¼Ñ™â€Ð¼ÑœÑ˜", "Ð»Ð„Â©Ð¼Ñ™â€Ð¼ÑœÑ˜", "ÐºÑ‘â‚¬Ð¼Ñ™â€Ð¼ÑœÑ˜", "Ð½â€  Ð¼Ñ™â€Ð¼ÑœÑ˜"]
            },
            it: { // Italian
                months: [
                    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
                ],
                dayOfWeekShort: [
                    "Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"
                ],
                dayOfWeek: ["Domenica", "LunedÐ“Â¬", "MartedÐ“Â¬", "MercoledÐ“Â¬", "GiovedÐ“Â¬", "VenerdÐ“Â¬", "Sabato"]
            },
            da: { // Dansk
                months: [
                    "January", "Februar", "Marts", "April", "Maj", "Juni", "July", "August", "September", "Oktober", "November", "December"
                ],
                dayOfWeekShort: [
                    "SÐ“Ñ‘n", "Man", "Tir", "Ons", "Tor", "Fre", "LÐ“Ñ‘r"
                ],
                dayOfWeek: ["sÐ“Ñ‘ndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lÐ“Ñ‘rdag"]
            },
            no: { // Norwegian
                months: [
                    "Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"
                ],
                dayOfWeekShort: [
                    "SÐ“Ñ‘n", "Man", "Tir", "Ons", "Tor", "Fre", "LÐ“Ñ‘r"
                ],
                dayOfWeek: ['SÐ“Ñ‘ndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'LÐ“Ñ‘rdag']
            },
            ja: { // Japanese
                months: [
                    "1Ð¶Ñšâ‚¬", "2Ð¶Ñšâ‚¬", "3Ð¶Ñšâ‚¬", "4Ð¶Ñšâ‚¬", "5Ð¶Ñšâ‚¬", "6Ð¶Ñšâ‚¬", "7Ð¶Ñšâ‚¬", "8Ð¶Ñšâ‚¬", "9Ð¶Ñšâ‚¬", "10Ð¶Ñšâ‚¬", "11Ð¶Ñšâ‚¬", "12Ð¶Ñšâ‚¬"
                ],
                dayOfWeekShort: [
                    "Ð¶â€”Ò", "Ð¶Ñšâ‚¬", "Ð·ÐƒÂ«", "Ð¶Â°Ò‘", "Ð¶ÑšÐ", "Ð¹â€¡â€˜", "ÐµÑšÑŸ"
                ],
                dayOfWeek: ["Ð¶â€”ÒÐ¶â€ºÑš", "Ð¶Ñšâ‚¬Ð¶â€ºÑš", "Ð·ÐƒÂ«Ð¶â€ºÑš", "Ð¶Â°Ò‘Ð¶â€ºÑš", "Ð¶ÑšÐÐ¶â€ºÑš", "Ð¹â€¡â€˜Ð¶â€ºÑš", "ÐµÑšÑŸÐ¶â€ºÑš"]
            },
            vi: { // Vietnamese
                months: [
                    "ThÐ“ÐŽng 1", "ThÐ“ÐŽng 2", "ThÐ“ÐŽng 3", "ThÐ“ÐŽng 4", "ThÐ“ÐŽng 5", "ThÐ“ÐŽng 6", "ThÐ“ÐŽng 7", "ThÐ“ÐŽng 8", "ThÐ“ÐŽng 9", "ThÐ“ÐŽng 10", "ThÐ“ÐŽng 11", "ThÐ“ÐŽng 12"
                ],
                dayOfWeekShort: [
                    "CN", "T2", "T3", "T4", "T5", "T6", "T7"
                ],
                dayOfWeek: ["ChÐ±Â»Â§ nhÐ±Ñ”Â­t", "ThÐ±Â»Â© hai", "ThÐ±Â»Â© ba", "ThÐ±Â»Â© tÐ–Â°", "ThÐ±Â»Â© nÐ”Ñ“m", "ThÐ±Â»Â© sÐ“ÐŽu", "ThÐ±Â»Â© bÐ±Ñ”Ðˆy"]
            },
            sl: { // SlovenÐ•ÐŽÐ”ÐŒina
                months: [
                    "Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"
                ],
                dayOfWeekShort: [
                    "Ned", "Pon", "Tor", "Sre", "Ð”ÐŠet", "Pet", "Sob"
                ],
                dayOfWeek: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Ð”ÐŠetrtek", "Petek", "Sobota"]
            },
            cs: { // Ð”ÐŠeÐ•ÐŽtina
                months: [
                    "Leden", "Ð“Ñ™nor", "BÐ•â„¢ezen", "Duben", "KvÐ”â€ºten", "Ð”ÐŠerven", "Ð”ÐŠervenec", "Srpen", "ZÐ“ÐŽÐ•â„¢Ð“Â­", "Ð•Â˜Ð“Â­jen", "Listopad", "Prosinec"
                ],
                dayOfWeekShort: [
                    "Ne", "Po", "Ð“Ñ™t", "St", "Ð”ÐŠt", "PÐ“ÐŽ", "So"
                ]
            },
            hu: { // Hungarian
                months: [
                    "JanuÐ“ÐŽr", "FebruÐ“ÐŽr", "MÐ“ÐŽrcius", "Ð“Ðƒprilis", "MÐ“ÐŽjus", "JÐ“Ñ”nius", "JÐ“Ñ”lius", "Augusztus", "Szeptember", "OktÐ“Ñ–ber", "November", "December"
                ],
                dayOfWeekShort: [
                    "Va", "HÐ“Â©", "Ke", "Sze", "Cs", "PÐ“Â©", "Szo"
                ],
                dayOfWeek: ["vasÐ“ÐŽrnap", "hÐ“Â©tfÐ•â€˜", "kedd", "szerda", "csÐ“Ñ˜tÐ“Â¶rtÐ“Â¶k", "pÐ“Â©ntek", "szombat"]
            },
            az: { //Azerbaijanian (Azeri)
                months: [
                    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
                ],
                dayOfWeekShort: [
                    "B", "Be", "Ð“â€¡a", "Ð“â€¡", "Ca", "C", "Ð•Ñ›"
                ],
                dayOfWeek: ["Bazar", "Bazar ertÐ™â„¢si", "Ð“â€¡Ð™â„¢rÐ•ÑŸÐ™â„¢nbÐ™â„¢ axÐ•ÑŸamÐ”Â±", "Ð“â€¡Ð™â„¢rÐ•ÑŸÐ™â„¢nbÐ™â„¢", "CÐ“Ñ˜mÐ™â„¢ axÐ•ÑŸamÐ”Â±", "CÐ“Ñ˜mÐ™â„¢", "Ð•Ñ›Ð™â„¢nbÐ™â„¢"]
            },
            bs: { //Bosanski
                months: [
                    "Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
                ],
                dayOfWeekShort: [
                    "Ned", "Pon", "Uto", "Sri", "Ð”ÐŠet", "Pet", "Sub"
                ],
                dayOfWeek: ["Nedjelja","Ponedjeljak", "Utorak", "Srijeda", "Ð”ÐŠetvrtak", "Petak", "Subota"]
            },
            ca: { //CatalÐ“ 
                months: [
                    "Gener", "Febrer", "MarÐ“Â§", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
                ],
                dayOfWeekShort: [
                    "Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"
                ],
                dayOfWeek: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"]
            },
            'en-GB': { //English (British)
                months: [
                    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                ],
                dayOfWeekShort: [
                    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
                ],
                dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            },
            et: { //"Eesti"
                months: [
                    "Jaanuar", "Veebruar", "MÐ“Â¤rts", "Aprill", "Mai", "Juuni", "Juuli", "August", "September", "Oktoober", "November", "Detsember"
                ],
                dayOfWeekShort: [
                    "P", "E", "T", "K", "N", "R", "L"
                ],
                dayOfWeek: ["PÐ“Ñ˜hapÐ“Â¤ev", "EsmaspÐ“Â¤ev", "TeisipÐ“Â¤ev", "KolmapÐ“Â¤ev", "NeljapÐ“Â¤ev", "Reede", "LaupÐ“Â¤ev"]
            },
            eu: { //Euskara
                months: [
                    "Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua"
                ],
                dayOfWeekShort: [
                    "Ig.", "Al.", "Ar.", "Az.", "Og.", "Or.", "La."
                ],
                dayOfWeek: ['Igandea', 'Astelehena', 'Asteartea', 'Asteazkena', 'Osteguna', 'Ostirala', 'Larunbata']
            },
            fi: { //Finnish (Suomi)
                months: [
                    "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "KesÐ“Â¤kuu", "HeinÐ“Â¤kuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
                ],
                dayOfWeekShort: [
                    "Su", "Ma", "Ti", "Ke", "To", "Pe", "La"
                ],
                dayOfWeek: ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"]
            },
            gl: { //Galego
                months: [
                    "Xan", "Feb", "Maz", "Abr", "Mai", "Xun", "Xul", "Ago", "Set", "Out", "Nov", "Dec"
                ],
                dayOfWeekShort: [
                    "Dom", "Lun", "Mar", "Mer", "Xov", "Ven", "Sab"
                ],
                dayOfWeek: ["Domingo", "Luns", "Martes", "MÐ“Â©rcores", "Xoves", "Venres", "SÐ“ÐŽbado"]
            },
            hr: { //Hrvatski
                months: [
                    "SijeÐ”ÐŒanj", "VeljaÐ”ÐŒa", "OÐ•Ñ•ujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"
                ],
                dayOfWeekShort: [
                    "Ned", "Pon", "Uto", "Sri", "Ð”ÐŠet", "Pet", "Sub"
                ],
                dayOfWeek: ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Ð”ÐŠetvrtak", "Petak", "Subota"]
            },
            ko: { //Korean (Ð½â€¢ÑšÐºÂµÂ­Ð¼â€“Ò‘)
                months: [
                    "1Ð¼â€ºâ€", "2Ð¼â€ºâ€", "3Ð¼â€ºâ€", "4Ð¼â€ºâ€", "5Ð¼â€ºâ€", "6Ð¼â€ºâ€", "7Ð¼â€ºâ€", "8Ð¼â€ºâ€", "9Ð¼â€ºâ€", "10Ð¼â€ºâ€", "11Ð¼â€ºâ€", "12Ð¼â€ºâ€"
                ],
                dayOfWeekShort: [
                    "Ð¼ÑœÑ˜", "Ð¼â€ºâ€", "Ð½â„¢â€", "Ð¼â‚¬Â˜", "Ð»Ð„Â©", "ÐºÑ‘â‚¬", "Ð½â€  "
                ],
                dayOfWeek: ["Ð¼ÑœÑ˜Ð¼Ñ™â€Ð¼ÑœÑ˜", "Ð¼â€ºâ€Ð¼Ñ™â€Ð¼ÑœÑ˜", "Ð½â„¢â€Ð¼Ñ™â€Ð¼ÑœÑ˜", "Ð¼â‚¬Â˜Ð¼Ñ™â€Ð¼ÑœÑ˜", "Ð»Ð„Â©Ð¼Ñ™â€Ð¼ÑœÑ˜", "ÐºÑ‘â‚¬Ð¼Ñ™â€Ð¼ÑœÑ˜", "Ð½â€  Ð¼Ñ™â€Ð¼ÑœÑ˜"]
            },
            lt: { //Lithuanian (lietuviÐ•Ñ–)
                months: [
                    "Sausio", "Vasario", "Kovo", "BalandÐ•Ñ•io", "GeguÐ•Ñ•Ð”â€”s", "BirÐ•Ñ•elio", "Liepos", "RugpjÐ•Â«Ð”ÐŒio", "RugsÐ”â€”jo", "Spalio", "LapkriÐ”ÐŒio", "GruodÐ•Ñ•io"
                ],
                dayOfWeekShort: [
                    "Sek", "Pir", "Ant", "Tre", "Ket", "Pen", "Ð• eÐ•ÐŽ"
                ],
                dayOfWeek: ["Sekmadienis", "Pirmadienis", "Antradienis", "TreÐ”ÐŒiadienis", "Ketvirtadienis", "Penktadienis", "Ð• eÐ•ÐŽtadienis"]
            },
            lv: { //Latvian (LatvieÐ•ÐŽu)
                months: [
                    "JanvÐ”Ðƒris", "FebruÐ”Ðƒris", "Marts", "AprÐ”Â«lis ", "Maijs", "JÐ•Â«nijs", "JÐ•Â«lijs", "Augusts", "Septembris", "Oktobris", "Novembris", "Decembris"
                ],
                dayOfWeekShort: [
                    "Sv", "Pr", "Ot", "Tr", "Ct", "Pk", "St"
                ],
                dayOfWeek: ["SvÐ”â€œtdiena", "Pirmdiena", "Otrdiena", "TreÐ•ÐŽdiena", "Ceturtdiena", "Piektdiena", "Sestdiena"]
            },
            mk: { //Macedonian (Ð ÑšÐ Â°Ð Ñ”Ð ÂµÐ Ò‘Ð Ñ•Ð Ð…Ð¡ÐƒÐ Ñ”Ð Ñ‘)
                months: [
                    "Ð¡Â˜Ð Â°Ð Ð…Ð¡Ñ“Ð Â°Ð¡Ð‚Ð Ñ‘", "Ð¡â€žÐ ÂµÐ Ð†Ð¡Ð‚Ð¡Ñ“Ð Â°Ð¡Ð‚Ð Ñ‘", "Ð Ñ˜Ð Â°Ð¡Ð‚Ð¡â€š", "Ð Â°Ð Ñ—Ð¡Ð‚Ð Ñ‘Ð Â»", "Ð Ñ˜Ð Â°Ð¡Â˜", "Ð¡Â˜Ð¡Ñ“Ð Ð…Ð Ñ‘", "Ð¡Â˜Ð¡Ñ“Ð Â»Ð Ñ‘", "Ð Â°Ð Ð†Ð Ñ–Ð¡Ñ“Ð¡ÐƒÐ¡â€š", "Ð¡ÐƒÐ ÂµÐ Ñ—Ð¡â€šÐ ÂµÐ Ñ˜Ð Ð†Ð¡Ð‚Ð Ñ‘", "Ð Ñ•Ð Ñ”Ð¡â€šÐ Ñ•Ð Ñ˜Ð Ð†Ð¡Ð‚Ð Ñ‘", "Ð Ð…Ð Ñ•Ð ÂµÐ Ñ˜Ð Ð†Ð¡Ð‚Ð Ñ‘", "Ð Ò‘Ð ÂµÐ Ñ”Ð ÂµÐ Ñ˜Ð Ð†Ð¡Ð‚Ð Ñ‘"
                ],
                dayOfWeekShort: [
                    "Ð Ð…Ð ÂµÐ Ò‘", "Ð Ñ—Ð Ñ•Ð Ð…", "Ð Ð†Ð¡â€šÐ Ñ•", "Ð¡ÐƒÐ¡Ð‚Ð Âµ", "Ð¡â€¡Ð ÂµÐ¡â€š", "Ð Ñ—Ð ÂµÐ¡â€š", "Ð¡ÐƒÐ Â°Ð Â±"
                ],
                dayOfWeek: ["Ð ÑœÐ ÂµÐ Ò‘Ð ÂµÐ Â»Ð Â°", "Ð ÑŸÐ Ñ•Ð Ð…Ð ÂµÐ Ò‘Ð ÂµÐ Â»Ð Ð…Ð Ñ‘Ð Ñ”", "Ð â€™Ð¡â€šÐ Ñ•Ð¡Ð‚Ð Ð…Ð Ñ‘Ð Ñ”", "Ð ÐŽÐ¡Ð‚Ð ÂµÐ Ò‘Ð Â°", "Ð Â§Ð ÂµÐ¡â€šÐ Ð†Ð¡Ð‚Ð¡â€šÐ Ñ•Ð Ñ”", "Ð ÑŸÐ ÂµÐ¡â€šÐ Ñ•Ð Ñ”", "Ð ÐŽÐ Â°Ð Â±Ð Ñ•Ð¡â€šÐ Â°"]
            },
            mn: { //Mongolian (Ð ÑšÐ Ñ•Ð Ð…Ð Ñ–Ð Ñ•Ð Â»)
                months: [
                    "1-Ð¡Ð‚ Ð¡ÐƒÐ Â°Ð¡Ð‚", "2-Ð¡Ð‚ Ð¡ÐƒÐ Â°Ð¡Ð‚", "3-Ð¡Ð‚ Ð¡ÐƒÐ Â°Ð¡Ð‚", "4-Ð¡Ð‚ Ð¡ÐƒÐ Â°Ð¡Ð‚", "5-Ð¡Ð‚ Ð¡ÐƒÐ Â°Ð¡Ð‚", "6-Ð¡Ð‚ Ð¡ÐƒÐ Â°Ð¡Ð‚", "7-Ð¡Ð‚ Ð¡ÐƒÐ Â°Ð¡Ð‚", "8-Ð¡Ð‚ Ð¡ÐƒÐ Â°Ð¡Ð‚", "9-Ð¡Ð‚ Ð¡ÐƒÐ Â°Ð¡Ð‚", "10-Ð¡Ð‚ Ð¡ÐƒÐ Â°Ð¡Ð‚", "11-Ð¡Ð‚ Ð¡ÐƒÐ Â°Ð¡Ð‚", "12-Ð¡Ð‚ Ð¡ÐƒÐ Â°Ð¡Ð‚"
                ],
                dayOfWeekShort: [
                    "Ð â€Ð Â°Ð Ð†", "Ð ÑšÐ¡ÐÐ Ñ–", "Ð â€ºÐ¡â€¦Ð Â°", "Ð ÑŸÐ¢Ð‡Ð¡Ð‚", "Ð â€˜Ð¡ÐƒÐ Ð…", "Ð â€˜Ð¡ÐÐ Ñ˜", "Ð ÑœÐ¡ÐÐ Ñ˜"
                ],
                dayOfWeek: ["Ð â€Ð Â°Ð Ð†Ð Â°Ð Â°", "Ð ÑšÐ¡ÐÐ Ñ–Ð Ñ˜Ð Â°Ð¡Ð‚", "Ð â€ºÐ¡â€¦Ð Â°Ð Ñ–Ð Ð†Ð Â°", "Ð ÑŸÐ¢Ð‡Ð¡Ð‚Ð¡ÐŒÐ Ð†", "Ð â€˜Ð Â°Ð Â°Ð¡ÐƒÐ Â°Ð Ð…", "Ð â€˜Ð¡ÐÐ Ñ˜Ð Â±Ð Â°", "Ð ÑœÐ¡ÐÐ Ñ˜"]
            },
            'pt-BR': { //PortuguÐ“Ð„s(Brasil)
                months: [
                    "Janeiro", "Fevereiro", "MarÐ“Â§o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                ],
                dayOfWeekShort: [
                    "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "SÐ“ÐŽb"
                ],
                dayOfWeek: ["Domingo", "Segunda", "TerÐ“Â§a", "Quarta", "Quinta", "Sexta", "SÐ“ÐŽbado"]
            },
            sk: { //SlovenÐ”ÐŒina
                months: [
                    "JanuÐ“ÐŽr", "FebruÐ“ÐŽr", "Marec", "AprÐ“Â­l", "MÐ“ÐŽj", "JÐ“Ñ”n", "JÐ“Ñ”l", "August", "September", "OktÐ“Ñ–ber", "November", "December"
                ],
                dayOfWeekShort: [
                    "Ne", "Po", "Ut", "St", "Ð• t", "Pi", "So"
                ],
                dayOfWeek: ["NedeÐ”Ñ•a", "Pondelok", "Utorok", "Streda", "Ð• tvrtok", "Piatok", "Sobota"]
            },
            sq: { //Albanian (Shqip)
                months: [
                    "Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "NÐ“Â«ntor", "Dhjetor"
                ],
                dayOfWeekShort: [
                    "Die", "HÐ“Â«n", "Mar", "MÐ“Â«r", "Enj", "Pre", "Shtu"
                ],
                dayOfWeek: ["E Diel", "E HÐ“Â«nÐ“Â«", "E MartÐ”â€œ", "E MÐ“Â«rkurÐ“Â«", "E Enjte", "E Premte", "E ShtunÐ“Â«"]
            },
            'sr-YU': { //Serbian (Srpski)
                months: [
                    "Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
                ],
                dayOfWeekShort: [
                    "Ned", "Pon", "Uto", "Sre", "Ð”ÐŒet", "Pet", "Sub"
                ],
                dayOfWeek: ["Nedelja","Ponedeljak", "Utorak", "Sreda", "Ð”ÐŠetvrtak", "Petak", "Subota"]
            },
            sr: { //Serbian Cyrillic (Ð ÐŽÐ¡Ð‚Ð Ñ—Ð¡ÐƒÐ Ñ”Ð Ñ‘)
                months: [
                    "Ð¡Â˜Ð Â°Ð Ð…Ð¡Ñ“Ð Â°Ð¡Ð‚", "Ð¡â€žÐ ÂµÐ Â±Ð¡Ð‚Ð¡Ñ“Ð Â°Ð¡Ð‚", "Ð Ñ˜Ð Â°Ð¡Ð‚Ð¡â€š", "Ð Â°Ð Ñ—Ð¡Ð‚Ð Ñ‘Ð Â»", "Ð Ñ˜Ð Â°Ð¡Â˜", "Ð¡Â˜Ð¡Ñ“Ð Ð…", "Ð¡Â˜Ð¡Ñ“Ð Â»", "Ð Â°Ð Ð†Ð Ñ–Ð¡Ñ“Ð¡ÐƒÐ¡â€š", "Ð¡ÐƒÐ ÂµÐ Ñ—Ð¡â€šÐ ÂµÐ Ñ˜Ð Â±Ð Â°Ð¡Ð‚", "Ð Ñ•Ð Ñ”Ð¡â€šÐ Ñ•Ð Â±Ð Â°Ð¡Ð‚", "Ð Ð…Ð Ñ•Ð Ð†Ð ÂµÐ Ñ˜Ð Â±Ð Â°Ð¡Ð‚", "Ð Ò‘Ð ÂµÐ¡â€ Ð ÂµÐ Ñ˜Ð Â±Ð Â°Ð¡Ð‚"
                ],
                dayOfWeekShort: [
                    "Ð Ð…Ð ÂµÐ Ò‘", "Ð Ñ—Ð Ñ•Ð Ð…", "Ð¡Ñ“Ð¡â€šÐ Ñ•", "Ð¡ÐƒÐ¡Ð‚Ð Âµ", "Ð¡â€¡Ð ÂµÐ¡â€š", "Ð Ñ—Ð ÂµÐ¡â€š", "Ð¡ÐƒÐ¡Ñ“Ð Â±"
                ],
                dayOfWeek: ["Ð ÑœÐ ÂµÐ Ò‘Ð ÂµÐ¡â„¢Ð Â°","Ð ÑŸÐ Ñ•Ð Ð…Ð ÂµÐ Ò‘Ð ÂµÐ¡â„¢Ð Â°Ð Ñ”", "Ð ÐˆÐ¡â€šÐ Ñ•Ð¡Ð‚Ð Â°Ð Ñ”", "Ð ÐŽÐ¡Ð‚Ð ÂµÐ Ò‘Ð Â°", "Ð Â§Ð ÂµÐ¡â€šÐ Ð†Ð¡Ð‚Ð¡â€šÐ Â°Ð Ñ”", "Ð ÑŸÐ ÂµÐ¡â€šÐ Â°Ð Ñ”", "Ð ÐŽÐ¡Ñ“Ð Â±Ð Ñ•Ð¡â€šÐ Â°"]
            },
            sv: { //Svenska
                months: [
                    "Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"
                ],
                dayOfWeekShort: [
                    "SÐ“Â¶n", "MÐ“Òn", "Tis", "Ons", "Tor", "Fre", "LÐ“Â¶r"
                ],
                dayOfWeek: ["SÐ“Â¶ndag", "MÐ“Òndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "LÐ“Â¶rdag"]
            },
            'zh-TW': { //Traditional Chinese (Ð·â„–ÐƒÐ¹Â«â€Ð´Ñ‘Â­Ð¶â€“â€¡)
                months: [
                    "Ð´Ñ‘Ð‚Ð¶Ñšâ‚¬", "Ð´Ñ”ÐŠÐ¶Ñšâ‚¬", "Ð´Ñ‘â€°Ð¶Ñšâ‚¬", "Ðµâ€ºâ€ºÐ¶Ñšâ‚¬", "Ð´Ñ”â€Ð¶Ñšâ‚¬", "Ðµâ€¦Â­Ð¶Ñšâ‚¬", "Ð´Ñ‘Ñ“Ð¶Ñšâ‚¬", "Ðµâ€¦Â«Ð¶Ñšâ‚¬", "Ð´â„–ÑœÐ¶Ñšâ‚¬", "ÐµÐŒÐƒÐ¶Ñšâ‚¬", "ÐµÐŒÐƒÐ´Ñ‘Ð‚Ð¶Ñšâ‚¬", "ÐµÐŒÐƒÐ´Ñ”ÐŠÐ¶Ñšâ‚¬"
                ],
                dayOfWeekShort: [
                    "Ð¶â€”Ò", "Ð´Ñ‘Ð‚", "Ð´Ñ”ÐŠ", "Ð´Ñ‘â€°", "Ðµâ€ºâ€º", "Ð´Ñ”â€", "Ðµâ€¦Â­"
                ],
                dayOfWeek: ["Ð¶Â˜ÑŸÐ¶ÑšÑŸÐ¶â€”Ò", "Ð¶Â˜ÑŸÐ¶ÑšÑŸÐ´Ñ‘Ð‚", "Ð¶Â˜ÑŸÐ¶ÑšÑŸÐ´Ñ”ÐŠ", "Ð¶Â˜ÑŸÐ¶ÑšÑŸÐ´Ñ‘â€°", "Ð¶Â˜ÑŸÐ¶ÑšÑŸÐµâ€ºâ€º", "Ð¶Â˜ÑŸÐ¶ÑšÑŸÐ´Ñ”â€", "Ð¶Â˜ÑŸÐ¶ÑšÑŸÐµâ€¦Â­"]
            },
            zh: { //Simplified Chinese (Ð·Â®Ð‚Ð´Ð…â€œÐ´Ñ‘Â­Ð¶â€“â€¡)
                months: [
                    "Ð´Ñ‘Ð‚Ð¶Ñšâ‚¬", "Ð´Ñ”ÐŠÐ¶Ñšâ‚¬", "Ð´Ñ‘â€°Ð¶Ñšâ‚¬", "Ðµâ€ºâ€ºÐ¶Ñšâ‚¬", "Ð´Ñ”â€Ð¶Ñšâ‚¬", "Ðµâ€¦Â­Ð¶Ñšâ‚¬", "Ð´Ñ‘Ñ“Ð¶Ñšâ‚¬", "Ðµâ€¦Â«Ð¶Ñšâ‚¬", "Ð´â„–ÑœÐ¶Ñšâ‚¬", "ÐµÐŒÐƒÐ¶Ñšâ‚¬", "ÐµÐŒÐƒÐ´Ñ‘Ð‚Ð¶Ñšâ‚¬", "ÐµÐŒÐƒÐ´Ñ”ÐŠÐ¶Ñšâ‚¬"
                ],
                dayOfWeekShort: [
                    "Ð¶â€”Ò", "Ð´Ñ‘Ð‚", "Ð´Ñ”ÐŠ", "Ð´Ñ‘â€°", "Ðµâ€ºâ€º", "Ð´Ñ”â€", "Ðµâ€¦Â­"
                ],
                dayOfWeek: ["Ð¶Â˜ÑŸÐ¶ÑšÑŸÐ¶â€”Ò", "Ð¶Â˜ÑŸÐ¶ÑšÑŸÐ´Ñ‘Ð‚", "Ð¶Â˜ÑŸÐ¶ÑšÑŸÐ´Ñ”ÐŠ", "Ð¶Â˜ÑŸÐ¶ÑšÑŸÐ´Ñ‘â€°", "Ð¶Â˜ÑŸÐ¶ÑšÑŸÐµâ€ºâ€º", "Ð¶Â˜ÑŸÐ¶ÑšÑŸÐ´Ñ”â€", "Ð¶Â˜ÑŸÐ¶ÑšÑŸÐµâ€¦Â­"]
            },
            he: { //Hebrew (Ð§ÑžÐ§â€˜Ð§ÐÐ§â„¢Ð§Ð„)
                months: [
                    'Ð§â„¢Ð§ Ð§â€¢Ð§Ñ’Ð§Ð', 'Ð§Â¤Ð§â€˜Ð§ÐÐ§â€¢Ð§Ñ’Ð§Ð', 'Ð§Ñ›Ð§ÐÐ§Ò', 'Ð§Ñ’Ð§Â¤Ð§ÐÐ§â„¢Ð§Ñš', 'Ð§Ñ›Ð§Ñ’Ð§â„¢', 'Ð§â„¢Ð§â€¢Ð§ Ð§â„¢', 'Ð§â„¢Ð§â€¢Ð§ÑšÐ§â„¢', 'Ð§Ñ’Ð§â€¢Ð§â€™Ð§â€¢Ð§ÐŽÐ§Â˜', 'Ð§ÐŽÐ§Â¤Ð§Â˜Ð§Ñ›Ð§â€˜Ð§Ð', 'Ð§Ñ’Ð§â€¢Ð§Â§Ð§Â˜Ð§â€¢Ð§â€˜Ð§Ð', 'Ð§ Ð§â€¢Ð§â€˜Ð§Ñ›Ð§â€˜Ð§Ð', 'Ð§â€œÐ§Â¦Ð§Ñ›Ð§â€˜Ð§Ð'
                ],
                dayOfWeekShort: [
                    'Ð§Ñ’\'', 'Ð§â€˜\'', 'Ð§â€™\'', 'Ð§â€œ\'', 'Ð§â€\'', 'Ð§â€¢\'', 'Ð§Â©Ð§â€˜Ð§Ð„'
                ],
                dayOfWeek: ["Ð§ÐÐ§Ñ’Ð§Â©Ð§â€¢Ð§ÑŸ", "Ð§Â©Ð§ Ð§â„¢", "Ð§Â©Ð§ÑšÐ§â„¢Ð§Â©Ð§â„¢", "Ð§ÐÐ§â€˜Ð§â„¢Ð§ÑžÐ§â„¢", "Ð§â€”Ð§Ñ›Ð§â„¢Ð§Â©Ð§â„¢", "Ð§Â©Ð§â„¢Ð§Â©Ð§â„¢", "Ð§Â©Ð§â€˜Ð§Ð„", "Ð§ÐÐ§Ñ’Ð§Â©Ð§â€¢Ð§ÑŸ"]
            },
            hy: { // Armenian
                months: [
                    "Ð¥Ð‚Ð¥Ñ‘Ð¦â€šÐ¥Â¶Ð¥Ñ•Ð¥ÐŽÐ¦Ð‚", "Ð¥â€œÐ¥ÒÐ¥Ñ—Ð¦Ð‚Ð¥Ñ•Ð¥ÐŽÐ¦Ð‚", "Ð¥â€žÐ¥ÐŽÐ¦Ð‚Ð¥Ñ—", "Ð¤Â±Ð¥Ñ”Ð¦Ð‚Ð¥Â«Ð¥Â¬", "Ð¥â€žÐ¥ÐŽÐ¥ÂµÐ¥Â«Ð¥Ð…", "Ð¥Ð‚Ð¥Ñ‘Ð¦â€šÐ¥Â¶Ð¥Â«Ð¥Ð…", "Ð¥Ð‚Ð¥Ñ‘Ð¦â€šÐ¥Â¬Ð¥Â«Ð¥Ð…", "Ð¥â€¢Ð¥ÐˆÐ¥Ñ‘Ð¥Ð…Ð¥Ñ—Ð¥Ñ‘Ð¥Ð…", "Ð¥ÐŒÐ¥ÒÐ¥Ñ”Ð¥Ñ—Ð¥ÒÐ¥Ò‘Ð¥ÑžÐ¥ÒÐ¦Ð‚", "Ð¥Ð‚Ð¥Ñ‘Ð¥Ð‡Ð¥Ñ—Ð¥ÒÐ¥Ò‘Ð¥ÑžÐ¥ÒÐ¦Ð‚", "Ð¥â€ Ð¥Ñ‘Ð¥ÂµÐ¥ÒÐ¥Ò‘Ð¥ÑžÐ¥ÒÐ¦Ð‚", "Ð¤Ò‘Ð¥ÒÐ¥Ð‡Ð¥Ñ—Ð¥ÒÐ¥Ò‘Ð¥ÑžÐ¥ÒÐ¦Ð‚"
                ],
                dayOfWeekShort: [
                    "Ð¤Ñ—Ð¥Â«", "Ð¤ÂµÐ¦Ð‚Ð¥Ð‡", "Ð¤ÂµÐ¦Ð‚Ð¦â€ž", "Ð¥â€°Ð¥Ñ‘Ð¦Ð‚", "Ð¥Ð‚Ð¥Â¶Ð¥Ðˆ", "Ð¥â‚¬Ð¦â€šÐ¦Ð‚Ð¥Ñž", "Ð¥â€¡Ð¥ÑžÐ¥Â©"
                ],
                dayOfWeek: ["Ð¤Ñ—Ð¥Â«Ð¦Ð‚Ð¥ÐŽÐ¥Ð‡Ð¥Â«", "Ð¤ÂµÐ¦Ð‚Ð¥Ð‡Ð¥Ñ‘Ð¦â€šÐ¥Â·Ð¥ÐŽÐ¥ÑžÐ¥Â©Ð¥Â«", "Ð¤ÂµÐ¦Ð‚Ð¥ÒÐ¦â€žÐ¥Â·Ð¥ÐŽÐ¥ÑžÐ¥Â©Ð¥Â«", "Ð¥â€°Ð¥Ñ‘Ð¦Ð‚Ð¥ÒÐ¦â€žÐ¥Â·Ð¥ÐŽÐ¥ÑžÐ¥Â©Ð¥Â«", "Ð¥Ð‚Ð¥Â«Ð¥Â¶Ð¥ÐˆÐ¥Â·Ð¥ÐŽÐ¥ÑžÐ¥Â©Ð¥Â«", "Ð¥â‚¬Ð¦â€šÐ¦Ð‚Ð¥ÑžÐ¥ÐŽÐ¥Â©", "Ð¥â€¡Ð¥ÐŽÐ¥ÑžÐ¥ÐŽÐ¥Â©"]
            },
            kg: { // Kyrgyz
                months: [
                    'Ð¢Â®Ð¡â€¡Ð¡â€šÐ¢Ð‡Ð Ð… Ð Â°Ð â„–Ð¡â€¹', 'Ð â€˜Ð Ñ‘Ð¡Ð‚Ð Ò‘Ð Ñ‘Ð Ð… Ð Â°Ð â„–Ð¡â€¹', 'Ð â€“Ð Â°Ð Â»Ð Ñ–Ð Â°Ð Ð… Ð Ñ™Ð¡Ñ“Ð¡Ð‚Ð Â°Ð Ð…', 'Ð Â§Ð¡â€¹Ð Ð… Ð Ñ™Ð¡Ñ“Ð¡Ð‚Ð Â°Ð Ð…', 'Ð â€˜Ð¡Ñ“Ð Ñ–Ð¡Ñ“', 'Ð Ñ™Ð¡Ñ“Ð Â»Ð Â¶Ð Â°', 'Ð ÑžÐ ÂµÐ Ñ”Ð Âµ', 'Ð â€˜Ð Â°Ð¡â‚¬ Ð Ñ›Ð Ñ•Ð Ð…Ð Â°', 'Ð Ñ’Ð¡ÐÐ Ñ” Ð Ñ›Ð Ñ•Ð Ð…Ð Â°', 'Ð ÑžÐ Ñ•Ð Ñ–Ð¡Ñ“Ð Â·Ð Ò‘Ð¡Ñ“Ð Ð… Ð Â°Ð â„–Ð¡â€¹', 'Ð â€“Ð ÂµÐ¡â€šÐ Ñ‘Ð Ð…Ð Ñ‘Ð Ð… Ð Â°Ð â„–Ð¡â€¹', 'Ð â€˜Ð ÂµÐ¡â‚¬Ð¡â€šÐ Ñ‘Ð Ð… Ð Â°Ð â„–Ð¡â€¹'
                ],
                dayOfWeekShort: [
                    "Ð â€“Ð ÂµÐ Ñ”", "Ð â€Ð¢Ð‡Ð â„–", "Ð ÐÐ ÂµÐ â„–", "Ð ÐÐ Â°Ð¡Ð‚", "Ð â€˜Ð ÂµÐ â„–", "Ð â€“Ð¡Ñ“Ð Ñ˜", "Ð Â˜Ð¡â‚¬Ð Âµ"
                ],
                dayOfWeek: [
                    "Ð â€“Ð ÂµÐ Ñ”Ð¡â‚¬Ð ÂµÐ Ñ˜Ð Â±", "Ð â€Ð¢Ð‡Ð â„–Ð¡â‚¬Ð£Â©Ð Ñ˜Ð Â±", "Ð ÐÐ ÂµÐ â„–Ð¡â‚¬Ð ÂµÐ Ñ˜Ð Â±", "Ð ÐÐ Â°Ð¡Ð‚Ð¡â‚¬Ð ÂµÐ Ñ˜Ð Â±", "Ð â€˜Ð ÂµÐ â„–Ð¡â‚¬Ð ÂµÐ Ñ˜Ð Â±Ð Ñ‘", "Ð â€“Ð¡Ñ“Ð Ñ˜Ð Â°", "Ð Â˜Ð¡â‚¬Ð ÂµÐ Ð…Ð Â±"
                ]
            },
            rm: { // Romansh
                months: [
                    "Schaner", "Favrer", "Mars", "Avrigl", "Matg", "Zercladur", "Fanadur", "Avust", "Settember", "October", "November", "December"
                ],
                dayOfWeekShort: [
                    "Du", "Gli", "Ma", "Me", "Gie", "Ve", "So"
                ],
                dayOfWeek: [
                    "Dumengia", "Glindesdi", "Mardi", "Mesemna", "Gievgia", "Venderdi", "Sonda"
                ]
            },
        },
        value: '',
        rtl: false,

        format: 'Y/m/d H:i',
        formatTime: 'H:i',
        formatDate: 'Y/m/d',

        startDate:  false, // new Date(), '1986/12/08', '-1970/01/05','-1970/01/05',
        step: 60,
        monthChangeSpinner: true,

        closeOnDateSelect: false,
        closeOnTimeSelect: true,
        closeOnWithoutClick: true,
        closeOnInputClick: true,

        timepicker: true,
        datepicker: true,
        weeks: false,

        defaultTime: false, // use formatTime format (ex. '10:00' for formatTime:   'H:i')
        defaultDate: false, // use formatDate format (ex new Date() or '1986/12/08' or '-1970/01/05' or '-1970/01/05')

        minDate: false,
        maxDate: false,
        minTime: false,
        maxTime: false,
        disabledMinTime: false,
        disabledMaxTime: false,

        allowTimes: [],
        opened: false,
        initTime: true,
        inline: false,
        theme: '',

        onSelectDate: function () {},
        onSelectTime: function () {},
        onChangeMonth: function () {},
        onGetWeekOfYear: function () {},
        onChangeYear: function () {},
        onChangeDateTime: function () {},
        onShow: function () {},
        onClose: function () {},
        onGenerate: function () {},

        withoutCopyright: true,
        inverseButton: false,
        hours12: false,
        next: 'xdsoft_next',
        prev : 'xdsoft_prev',
        dayOfWeekStart: 0,
        parentID: 'body',
        timeHeightInTimePicker: 25,
        timepickerScrollbar: true,
        todayButton: true,
        prevButton: true,
        nextButton: true,
        defaultSelect: true,

        scrollMonth: true,
        scrollTime: true,
        scrollInput: true,

        lazyInit: false,
        mask: false,
        validateOnBlur: true,
        allowBlank: true,
        yearStart: 2000,
        yearEnd: 2050,
        monthStart: 0,
        monthEnd: 11,
        style: '',
        id: '',
        fixed: false,
        roundTime: 'round', // ceil, floor
        className: '',
        weekends: [],
        highlightedDates: [],
        highlightedPeriods: [],
        allowDates : [],
        allowDateRe : null,
        disabledDates : [],
        disabledWeekDays: [],
        yearOffset: 0,
        beforeShowDay: null,

        enterLikeTab: true,
        showApplyButton: false
    };

    var dateHelper = null,
        globalLocaleDefault = 'en',
        globalLocale = 'en';

    var dateFormatterOptionsDefault = {
        meridiem: ['AM', 'PM']
    };

    var initDateFormatter = function(){
        var locale = default_options.i18n[globalLocale],
            opts = {
                days: locale.dayOfWeek,
                daysShort: locale.dayOfWeekShort,
                months: locale.months,
                monthsShort: $.map(locale.months, function(n){ return n.substring(0, 3) }),
            };

        dateHelper = new DateFormatter({
            dateSettings: $.extend({}, dateFormatterOptionsDefault, opts)
        });
    };

    // for locale settings
    $.datetimepicker = {
        setLocale: function(locale){
            var newLocale = default_options.i18n[locale]?locale:globalLocaleDefault;
            if(globalLocale != newLocale){
                globalLocale = newLocale;
                // reinit date formatter
                initDateFormatter();
            }
        },
        RFC_2822: 'D, d M Y H:i:s O',
        ATOM: 'Y-m-d\TH:i:sP',
        ISO_8601: 'Y-m-d\TH:i:sO',
        RFC_822: 'D, d M y H:i:s O',
        RFC_850: 'l, d-M-y H:i:s T',
        RFC_1036: 'D, d M y H:i:s O',
        RFC_1123: 'D, d M Y H:i:s O',
        RSS: 'D, d M Y H:i:s O',
        W3C: 'Y-m-d\TH:i:sP'
    };

    // first init date formatter
    initDateFormatter();

    // fix for ie8
    if (!window.getComputedStyle) {
        window.getComputedStyle = function (el, pseudo) {
            this.el = el;
            this.getPropertyValue = function (prop) {
                var re = /(\-([a-z]){1})/g;
                if (prop === 'float') {
                    prop = 'styleFloat';
                }
                if (re.test(prop)) {
                    prop = prop.replace(re, function (a, b, c) {
                        return c.toUpperCase();
                    });
                }
                return el.currentStyle[prop] || null;
            };
            return this;
        };
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (obj, start) {
            var i, j;
            for (i = (start || 0), j = this.length; i < j; i += 1) {
                if (this[i] === obj) { return i; }
            }
            return -1;
        };
    }
    Date.prototype.countDaysInMonth = function () {
        return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
    };
    $.fn.xdsoftScroller = function (percent) {
        return this.each(function () {
            var timeboxparent = $(this),
                pointerEventToXY = function (e) {
                    var out = {x: 0, y: 0},
                        touch;
                    if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
                        touch  = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                        out.x = touch.clientX;
                        out.y = touch.clientY;
                    } else if (e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
                        out.x = e.clientX;
                        out.y = e.clientY;
                    }
                    return out;
                },
                move = 0,
                timebox,
                parentHeight,
                height,
                scrollbar,
                scroller,
                maximumOffset = 100,
                start = false,
                startY = 0,
                startTop = 0,
                h1 = 0,
                touchStart = false,
                startTopScroll = 0,
                calcOffset = function () {};
            if (percent === 'hide') {
                timeboxparent.find('.xdsoft_scrollbar').hide();
                return;
            }
            if (!$(this).hasClass('xdsoft_scroller_box')) {
                timebox = timeboxparent.children().eq(0);
                parentHeight = timeboxparent[0].clientHeight;
                height = timebox[0].offsetHeight;
                scrollbar = $('<div class="xdsoft_scrollbar"></div>');
                scroller = $('<div class="xdsoft_scroller"></div>');
                scrollbar.append(scroller);

                timeboxparent.addClass('xdsoft_scroller_box').append(scrollbar);
                calcOffset = function calcOffset(event) {
                    var offset = pointerEventToXY(event).y - startY + startTopScroll;
                    if (offset < 0) {
                        offset = 0;
                    }
                    if (offset + scroller[0].offsetHeight > h1) {
                        offset = h1 - scroller[0].offsetHeight;
                    }
                    timeboxparent.trigger('scroll_element.xdsoft_scroller', [maximumOffset ? offset / maximumOffset : 0]);
                };

                scroller
                    .on('touchstart.xdsoft_scroller mousedown.xdsoft_scroller', function (event) {
                        if (!parentHeight) {
                            timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percent]);
                        }

                        startY = pointerEventToXY(event).y;
                        startTopScroll = parseInt(scroller.css('margin-top'), 10);
                        h1 = scrollbar[0].offsetHeight;

                        if (event.type === 'mousedown' || event.type === 'touchstart') {
                            if (document) {
                                $(document.body).addClass('xdsoft_noselect');
                            }
                            $([document.body, window]).on('touchend mouseup.xdsoft_scroller', function arguments_callee() {
                                $([document.body, window]).off('touchend mouseup.xdsoft_scroller', arguments_callee)
                                    .off('mousemove.xdsoft_scroller', calcOffset)
                                    .removeClass('xdsoft_noselect');
                            });
                            $(document.body).on('mousemove.xdsoft_scroller', calcOffset);
                        } else {
                            touchStart = true;
                            event.stopPropagation();
                            event.preventDefault();
                        }
                    })
                    .on('touchmove', function (event) {
                        if (touchStart) {
                            event.preventDefault();
                            calcOffset(event);
                        }
                    })
                    .on('touchend touchcancel', function (event) {
                        touchStart =  false;
                        startTopScroll = 0;
                    });

                timeboxparent
                    .on('scroll_element.xdsoft_scroller', function (event, percentage) {
                        if (!parentHeight) {
                            timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percentage, true]);
                        }
                        percentage = percentage > 1 ? 1 : (percentage < 0 || isNaN(percentage)) ? 0 : percentage;

                        scroller.css('margin-top', maximumOffset * percentage);

                        setTimeout(function () {
                            timebox.css('marginTop', -parseInt((timebox[0].offsetHeight - parentHeight) * percentage, 10));
                        }, 10);
                    })
                    .on('resize_scroll.xdsoft_scroller', function (event, percentage, noTriggerScroll) {
                        var percent, sh;
                        parentHeight = timeboxparent[0].clientHeight;
                        height = timebox[0].offsetHeight;
                        percent = parentHeight / height;
                        sh = percent * scrollbar[0].offsetHeight;
                        if (percent > 1) {
                            scroller.hide();
                        } else {
                            scroller.show();
                            scroller.css('height', parseInt(sh > 10 ? sh : 10, 10));
                            maximumOffset = scrollbar[0].offsetHeight - scroller[0].offsetHeight;
                            if (noTriggerScroll !== true) {
                                timeboxparent.trigger('scroll_element.xdsoft_scroller', [percentage || Math.abs(parseInt(timebox.css('marginTop'), 10)) / (height - parentHeight)]);
                            }
                        }
                    });

                timeboxparent.on('mousewheel', function (event) {
                    var top = Math.abs(parseInt(timebox.css('marginTop'), 10));

                    top = top - (event.deltaY * 20);
                    if (top < 0) {
                        top = 0;
                    }

                    timeboxparent.trigger('scroll_element.xdsoft_scroller', [top / (height - parentHeight)]);
                    event.stopPropagation();
                    return false;
                });

                timeboxparent.on('touchstart', function (event) {
                    start = pointerEventToXY(event);
                    startTop = Math.abs(parseInt(timebox.css('marginTop'), 10));
                });

                timeboxparent.on('touchmove', function (event) {
                    if (start) {
                        event.preventDefault();
                        var coord = pointerEventToXY(event);
                        timeboxparent.trigger('scroll_element.xdsoft_scroller', [(startTop - (coord.y - start.y)) / (height - parentHeight)]);
                    }
                });

                timeboxparent.on('touchend touchcancel', function (event) {
                    start = false;
                    startTop = 0;
                });
            }
            timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percent]);
        });
    };

    $.fn.datetimepicker = function (opt, opt2) {
        var result = this,
            KEY0 = 48,
            KEY9 = 57,
            _KEY0 = 96,
            _KEY9 = 105,
            CTRLKEY = 17,
            DEL = 46,
            ENTER = 13,
            ESC = 27,
            BACKSPACE = 8,
            ARROWLEFT = 37,
            ARROWUP = 38,
            ARROWRIGHT = 39,
            ARROWDOWN = 40,
            TAB = 9,
            F5 = 116,
            AKEY = 65,
            CKEY = 67,
            VKEY = 86,
            ZKEY = 90,
            YKEY = 89,
            ctrlDown    =   false,
            options = ($.isPlainObject(opt) || !opt) ? $.extend(true, {}, default_options, opt) : $.extend(true, {}, default_options),

            lazyInitTimer = 0,
            createDateTimePicker,
            destroyDateTimePicker,

            lazyInit = function (input) {
                input
                    .on('open.xdsoft focusin.xdsoft mousedown.xdsoft touchstart', function initOnActionCallback(event) {
                        if (input.is(':disabled') || input.data('xdsoft_datetimepicker')) {
                            return;
                        }
                        clearTimeout(lazyInitTimer);
                        lazyInitTimer = setTimeout(function () {

                            if (!input.data('xdsoft_datetimepicker')) {
                                createDateTimePicker(input);
                            }
                            input
                                .off('open.xdsoft focusin.xdsoft mousedown.xdsoft touchstart', initOnActionCallback)
                                .trigger('open.xdsoft');
                        }, 100);
                    });
            };

        createDateTimePicker = function (input) {
            var datetimepicker = $('<div class="xdsoft_datetimepicker xdsoft_noselect"></div>'),
                xdsoft_copyright = $('<div class="xdsoft_copyright"><a target="_blank" href="http://xdsoft.net/jqplugins/datetimepicker/">xdsoft.net</a></div>'),
                datepicker = $('<div class="xdsoft_datepicker active"></div>'),
                mounth_picker = $('<div class="xdsoft_mounthpicker head-of-dateTime"><button type="button" class="xdsoft_prev navigate-arrow nav-prev month-prev"></button><button type="button" class="xdsoft_today_button"></button>' +
                    '<div class="xdsoft_label xdsoft_month"><span></span><i></i></div>' +
                    '<div class="xdsoft_label xdsoft_year"><span></span><i></i></div>' +
                    '<div class="month-year"><div class="mounthes"><div class="wrap-mouth"></div></div><div class="year"></div></div>'+
                    '<button type="button" class="xdsoft_next navigate-arrow nav-next month-next" ></button></div>'),
                calendar = $('<div class="xdsoft_calendar"></div>'),
                timepicker = $('<div class="xdsoft_timepicker active"><button type="button" class="xdsoft_prev"></button><div class="xdsoft_time_box"></div><button type="button" class="xdsoft_next"></button></div>'),
                timeboxparent = timepicker.find('.xdsoft_time_box').eq(0),
                timebox = $('<div class="xdsoft_time_variant"></div>'),
                applyButton = $('<button type="button" class="xdsoft_save_selected blue-gradient-button">Save Selected</button>'),

                monthselect = $('<div class="xdsoft_select xdsoft_monthselect"><div></div></div>'),
                yearselect = $('<div class="xdsoft_select xdsoft_yearselect"><div></div></div>'),
                triggerAfterOpen = false,
                XDSoft_datetime,

                xchangeTimer,
                timerclick,
                current_time_index,
                setPos,
                timer = 0,
                timer1 = 0,
                _xdsoft_datetime;

            if (options.id) {
                datetimepicker.attr('id', options.id);
            }
            if (options.style) {
                datetimepicker.attr('style', options.style);
            }
            if (options.weeks) {
                datetimepicker.addClass('xdsoft_showweeks');
            }
            if (options.rtl) {
                datetimepicker.addClass('xdsoft_rtl');
            }

            datetimepicker.addClass('xdsoft_' + options.theme);
            datetimepicker.addClass(options.className);

            mounth_picker
                .find('.xdsoft_month span')
                    .after(monthselect);
            mounth_picker
                .find('.xdsoft_year span')
                    .after(yearselect);

            mounth_picker
                .find('.xdsoft_month,.xdsoft_year')
                    .on('touchstart mousedown.xdsoft', function (event) {
                    var select = $(this).find('.xdsoft_select').eq(0),
                        val = 0,
                        top = 0,
                        visible = select.is(':visible'),
                        items,
                        i;

                    mounth_picker
                        .find('.xdsoft_select')
                            .hide();
                    if (_xdsoft_datetime.currentTime) {
                        val = _xdsoft_datetime.currentTime[$(this).hasClass('xdsoft_month') ? 'getMonth' : 'getFullYear']();
                    }

                    select[visible ? 'hide' : 'show']();
                    for (items = select.find('div.xdsoft_option'), i = 0; i < items.length; i += 1) {
                        if (items.eq(i).data('value') === val) {
                            break;
                        } else {
                            top += items[0].offsetHeight;
                        }
                    }

                    select.xdsoftScroller(top / (select.children()[0].offsetHeight - (select[0].clientHeight)));
                    event.stopPropagation();

                    return false;
                });

            mounth_picker
                .find('.xdsoft_select')
                    .xdsoftScroller()
                .on('touchstart mousedown.xdsoft', function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                })
                .on('touchstart mousedown.xdsoft', '.xdsoft_option', function (event) {
                    if (_xdsoft_datetime.currentTime === undefined || _xdsoft_datetime.currentTime === null) {
                        _xdsoft_datetime.currentTime = _xdsoft_datetime.now();
                    }

                    var year = _xdsoft_datetime.currentTime.getFullYear();
                    if (_xdsoft_datetime && _xdsoft_datetime.currentTime) {
                        _xdsoft_datetime.currentTime[$(this).parent().parent().hasClass('xdsoft_monthselect') ? 'setMonth' : 'setFullYear']($(this).data('value'));
                    }

                    $(this).parent().parent().hide();

                    datetimepicker.trigger('xchange.xdsoft');
                    if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
                        options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }

                    if (year !== _xdsoft_datetime.currentTime.getFullYear() && $.isFunction(options.onChangeYear)) {
                        options.onChangeYear.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }
                });

            datetimepicker.getValue = function () {
                return _xdsoft_datetime.getCurrentTime();
            };

            datetimepicker.setOptions = function (_options) {
                var highlightedDates = {};


                options = $.extend(true, {}, options, _options);

                if (_options.allowTimes && $.isArray(_options.allowTimes) && _options.allowTimes.length) {
                    options.allowTimes = $.extend(true, [], _options.allowTimes);
                }

                if (_options.weekends && $.isArray(_options.weekends) && _options.weekends.length) {
                    options.weekends = $.extend(true, [], _options.weekends);
                }

                if (_options.allowDates && $.isArray(_options.allowDates) && _options.allowDates.length) {
                    options.allowDates = $.extend(true, [], _options.allowDates);
                }

                if (_options.allowDateRe && Object.prototype.toString.call(_options.allowDateRe)==="[object String]") {
                    options.allowDateRe = new RegExp(_options.allowDateRe);
                }

                if (_options.highlightedDates && $.isArray(_options.highlightedDates) && _options.highlightedDates.length) {
                    $.each(_options.highlightedDates, function (index, value) {
                        var splitData = $.map(value.split(','), $.trim),
                            exDesc,
                            hDate = new HighlightedDate(dateHelper.parseDate(splitData[0], options.formatDate), splitData[1], splitData[2]), // date, desc, style
                            keyDate = dateHelper.formatDate(hDate.date, options.formatDate);
                        if (highlightedDates[keyDate] !== undefined) {
                            exDesc = highlightedDates[keyDate].desc;
                            if (exDesc && exDesc.length && hDate.desc && hDate.desc.length) {
                                highlightedDates[keyDate].desc = exDesc + "\n" + hDate.desc;
                            }
                        } else {
                            highlightedDates[keyDate] = hDate;
                        }
                    });

                    options.highlightedDates = $.extend(true, [], highlightedDates);
                }

                if (_options.highlightedPeriods && $.isArray(_options.highlightedPeriods) && _options.highlightedPeriods.length) {
                    highlightedDates = $.extend(true, [], options.highlightedDates);
                    $.each(_options.highlightedPeriods, function (index, value) {
                        var dateTest, // start date
                            dateEnd,
                            desc,
                            hDate,
                            keyDate,
                            exDesc,
                            style;
                        if ($.isArray(value)) {
                            dateTest = value[0];
                            dateEnd = value[1];
                            desc = value[2];
                            style = value[3];
                        }
                        else {
                            var splitData = $.map(value.split(','), $.trim);
                            dateTest = dateHelper.parseDate(splitData[0], options.formatDate);
                            dateEnd = dateHelper.parseDate(splitData[1], options.formatDate);
                            desc = splitData[2];
                            style = splitData[3];
                        }

                        while (dateTest <= dateEnd) {
                            hDate = new HighlightedDate(dateTest, desc, style);
                            keyDate = dateHelper.formatDate(dateTest, options.formatDate);
                            dateTest.setDate(dateTest.getDate() + 1);
                            if (highlightedDates[keyDate] !== undefined) {
                                exDesc = highlightedDates[keyDate].desc;
                                if (exDesc && exDesc.length && hDate.desc && hDate.desc.length) {
                                    highlightedDates[keyDate].desc = exDesc + "\n" + hDate.desc;
                                }
                            } else {
                                highlightedDates[keyDate] = hDate;
                            }
                        }
                    });

                    options.highlightedDates = $.extend(true, [], highlightedDates);
                }

                if (_options.disabledDates && $.isArray(_options.disabledDates) && _options.disabledDates.length) {
                    options.disabledDates = $.extend(true, [], _options.disabledDates);
                }

                if (_options.disabledWeekDays && $.isArray(_options.disabledWeekDays) && _options.disabledWeekDays.length) {
                    options.disabledWeekDays = $.extend(true, [], _options.disabledWeekDays);
                }

                if ((options.open || options.opened) && (!options.inline)) {
                    input.trigger('open.xdsoft');
                }

                if (options.inline) {
                    triggerAfterOpen = true;
                    datetimepicker.addClass('xdsoft_inline');
                    input.after(datetimepicker).hide();
                }

                if (options.inverseButton) {
                    options.next = 'xdsoft_prev';
                    options.prev = 'xdsoft_next';
                }

                if (options.datepicker) {
                    datepicker.addClass('active');
                } else {
                    datepicker.removeClass('active');
                }

                if (options.timepicker) {
                    timepicker.addClass('active');
                } else {
                    timepicker.removeClass('active');
                }

                if (options.value) {
                    _xdsoft_datetime.setCurrentTime(options.value);
                    if (input && input.val) {
                        input.val(_xdsoft_datetime.str);
                    }
                }

                if (isNaN(options.dayOfWeekStart)) {
                    options.dayOfWeekStart = 0;
                } else {
                    options.dayOfWeekStart = parseInt(options.dayOfWeekStart, 10) % 7;
                }

                if (!options.timepickerScrollbar) {
                    timeboxparent.xdsoftScroller('hide');
                }

                if (options.minDate && /^[\+\-](.*)$/.test(options.minDate)) {
                    options.minDate = dateHelper.formatDate(_xdsoft_datetime.strToDateTime(options.minDate), options.formatDate);
                }

                if (options.maxDate &&  /^[\+\-](.*)$/.test(options.maxDate)) {
                    options.maxDate = dateHelper.formatDate(_xdsoft_datetime.strToDateTime(options.maxDate), options.formatDate);
                }

                applyButton.toggle(options.showApplyButton);

                mounth_picker
                    .find('.xdsoft_today_button')
                        .css('visibility', !options.todayButton ? 'hidden' : 'visible');

                mounth_picker
                    .find('.' + options.prev)
                        .css('visibility', !options.prevButton ? 'hidden' : 'visible');

                mounth_picker
                    .find('.' + options.next)
                        .css('visibility', !options.nextButton ? 'hidden' : 'visible');

                setMask(options);

                if (options.validateOnBlur) {
                    input
                        .off('blur.xdsoft')
                        .on('blur.xdsoft', function () {
                            if (options.allowBlank && (!$.trim($(this).val()).length || $.trim($(this).val()) === options.mask.replace(/[0-9]/g, '_'))) {
                                $(this).val(null);
                                datetimepicker.data('xdsoft_datetime').empty();
                            } else if (!dateHelper.parseDate($(this).val(), options.format)) {
                                var splittedHours   = +([$(this).val()[0], $(this).val()[1]].join('')),
                                    splittedMinutes = +([$(this).val()[2], $(this).val()[3]].join(''));

                                // parse the numbers as 0312 => 03:12
                                if (!options.datepicker && options.timepicker && splittedHours >= 0 && splittedHours < 24 && splittedMinutes >= 0 && splittedMinutes < 60) {
                                    $(this).val([splittedHours, splittedMinutes].map(function (item) {
                                        return item > 9 ? item : '0' + item;
                                    }).join(':'));
                                } else {
                                    $(this).val(dateHelper.formatDate(_xdsoft_datetime.now(), options.format));
                                }

                                datetimepicker.data('xdsoft_datetime').setCurrentTime($(this).val());
                            } else {
                                datetimepicker.data('xdsoft_datetime').setCurrentTime($(this).val());
                            }

                            datetimepicker.trigger('changedatetime.xdsoft');
                            datetimepicker.trigger('close.xdsoft');
                        });
                }
                options.dayOfWeekStartPrev = (options.dayOfWeekStart === 0) ? 6 : options.dayOfWeekStart - 1;

                datetimepicker
                    .trigger('xchange.xdsoft')
                    .trigger('afterOpen.xdsoft');
            };

            datetimepicker
                .data('options', options)
                .on('touchstart mousedown.xdsoft', function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    yearselect.hide();
                    monthselect.hide();
                    return false;
                });

            //scroll_element = timepicker.find('.xdsoft_time_box');
            timeboxparent.append(timebox);
            timeboxparent.xdsoftScroller();

            datetimepicker.on('afterOpen.xdsoft', function () {
                timeboxparent.xdsoftScroller();
            });

            datetimepicker
                .append(datepicker)
                .append(timepicker);

            if (options.withoutCopyright !== true) {
                datetimepicker
                    .append(xdsoft_copyright);
            }

            datepicker
                .append(mounth_picker)
                .append(calendar)
                .append(applyButton);

            $(options.parentID)
                .append(datetimepicker);

            XDSoft_datetime = function () {
                var _this = this;
                console.log(_this);
                _this.now = function (norecursion) {
                    var d = new Date(),
                        date,
                        time;

                    if (!norecursion && options.defaultDate) {
                        date = _this.strToDateTime(options.defaultDate);
                        d.setFullYear(date.getFullYear());
                        d.setMonth(date.getMonth());
                        d.setDate(date.getDate());
                    }

                    if (options.yearOffset) {
                        d.setFullYear(d.getFullYear() + options.yearOffset);
                    }

                    if (!norecursion && options.defaultTime) {
                        time = _this.strtotime(options.defaultTime);
                        d.setHours(time.getHours());
                        d.setMinutes(time.getMinutes());
                    }
                    return d;
                };

                _this.isValidDate = function (d) {
                    if (Object.prototype.toString.call(d) !== "[object Date]") {
                        return false;
                    }
                    return !isNaN(d.getTime());
                };

                _this.setCurrentTime = function (dTime) {
                    _this.currentTime = (typeof dTime === 'string') ? _this.strToDateTime(dTime) : _this.isValidDate(dTime) ? dTime : _this.now();
                    datetimepicker.trigger('xchange.xdsoft');
                };

                _this.empty = function () {
                    _this.currentTime = null;
                };

                _this.getCurrentTime = function (dTime) {
                    return _this.currentTime;
                };

                _this.nextMonth = function () {
                    clNP = 1;
                    $('.xdsoft_date').each(function(){
                            $(this).addClass('changing')
                    })
                    setTimeout(function(){

                        $('.wrap-mouth').animate({
                            left:'-33%'
                        },500, function(){
                            $('.wrap-mouth .month-focus').eq(0).appendTo('.wrap-mouth');
                            $('.wrap-mouth').attr('style', '')
                        })

                        if (_this.currentTime === undefined || _this.currentTime === null) {
                            _this.currentTime = _this.now();
                        }

                        var month = _this.currentTime.getMonth() + 1,
                            year;
                        if (month === 12) {
                            _this.currentTime.setFullYear(_this.currentTime.getFullYear() + 1);
                            month = 0;
                        }

                        year = _this.currentTime.getFullYear();

                        _this.currentTime.setDate(
                            Math.min(
                                new Date(_this.currentTime.getFullYear(), month + 1, 0).getDate(),
                                _this.currentTime.getDate()
                            )
                        );
                        _this.currentTime.setMonth(month);

                        if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
                            options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                        }

                        if (year !== _this.currentTime.getFullYear() && $.isFunction(options.onChangeYear)) {
                            options.onChangeYear.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                        }

                        datetimepicker.trigger('xchange.xdsoft');
                        return month;
                    },500)
                };

                _this.prevMonth = function () {
                    clNP = 1
                   $('.xdsoft_date').each(function(){
                        $(this).addClass('changing')
                    })
                    setTimeout(function(){
                        $('.wrap-mouth').animate({
                                left:'33%'
                            },500, function(){
                                $('.wrap-mouth .month-focus').eq($('.wrap-mouth .month-focus').length-1).prependTo('.wrap-mouth');
                                $('.wrap-mouth').attr('style', '')
                            })
                    if (_this.currentTime === undefined || _this.currentTime === null) {
                        _this.currentTime = _this.now();
                    }

                    var month = _this.currentTime.getMonth() - 1;
                    if (month === -1) {
                        _this.currentTime.setFullYear(_this.currentTime.getFullYear() - 1);
                        month = 11;
                    }
                    _this.currentTime.setDate(
                        Math.min(
                            new Date(_this.currentTime.getFullYear(), month + 1, 0).getDate(),
                            _this.currentTime.getDate()
                        )
                    );
                    _this.currentTime.setMonth(month);
                    if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
                        options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }
                    datetimepicker.trigger('xchange.xdsoft');
                    return month;

                 },500)
                };

                _this.getWeekOfYear = function (datetime) {
                    if (options.onGetWeekOfYear && $.isFunction(options.onGetWeekOfYear)) {
                        var week = options.onGetWeekOfYear.call(datetimepicker, datetime);
                        if (typeof week !== 'undefined') {
                            return week;
                        }
                    }
                    var onejan = new Date(datetime.getFullYear(), 0, 1);
                    //First week of the year is th one with the first Thursday according to ISO8601
                    if(onejan.getDay()!=4)
                        onejan.setMonth(0, 1 + ((4 - onejan.getDay()+ 7) % 7));
                    return Math.ceil((((datetime - onejan) / 86400000) + onejan.getDay() + 1) / 7);
                };

                _this.strToDateTime = function (sDateTime) {
                    var tmpDate = [], timeOffset, currentTime;

                    if (sDateTime && sDateTime instanceof Date && _this.isValidDate(sDateTime)) {
                        return sDateTime;
                    }

                    tmpDate = /^(\+|\-)(.*)$/.exec(sDateTime);
                    if (tmpDate) {
                        tmpDate[2] = dateHelper.parseDate(tmpDate[2], options.formatDate);
                    }
                    if (tmpDate  && tmpDate[2]) {
                        timeOffset = tmpDate[2].getTime() - (tmpDate[2].getTimezoneOffset()) * 60000;
                        currentTime = new Date((_this.now(true)).getTime() + parseInt(tmpDate[1] + '1', 10) * timeOffset);
                    } else {
                        currentTime = sDateTime ? dateHelper.parseDate(sDateTime, options.format) : _this.now();
                    }

                    if (!_this.isValidDate(currentTime)) {
                        currentTime = _this.now();
                    }

                    return currentTime;

                };

                _this.strToDate = function (sDate) {
                    if (sDate && sDate instanceof Date && _this.isValidDate(sDate)) {
                        return sDate;
                    }

                    var currentTime = sDate ? dateHelper.parseDate(sDate, options.formatDate) : _this.now(true);
                    if (!_this.isValidDate(currentTime)) {
                        currentTime = _this.now(true);
                    }
                    return currentTime;
                };

                _this.strtotime = function (sTime) {
                    if (sTime && sTime instanceof Date && _this.isValidDate(sTime)) {
                        return sTime;
                    }
                    var currentTime = sTime ? dateHelper.parseDate(sTime, options.formatTime) : _this.now(true);
                    if (!_this.isValidDate(currentTime)) {
                        currentTime = _this.now(true);
                    }
                    return currentTime;
                };

                _this.str = function () {
                    return dateHelper.formatDate(_this.currentTime, options.format);
                };
                _this.currentTime = this.now();
            };

            _xdsoft_datetime = new XDSoft_datetime();

            applyButton.on('touchend click', function (e) {//pathbrite
                e.preventDefault();
                datetimepicker.data('changed', true);
                _xdsoft_datetime.setCurrentTime(getCurrentValue());
                input.val(_xdsoft_datetime.str());
                datetimepicker.trigger('close.xdsoft');
            });
            mounth_picker
                .find('.xdsoft_today_button')
                .on('touchend mousedown.xdsoft', function () {
                    datetimepicker.data('changed', true);
                    _xdsoft_datetime.setCurrentTime(0);
                    datetimepicker.trigger('afterOpen.xdsoft');
                }).on('dblclick.xdsoft', function () {
                    var currentDate = _xdsoft_datetime.getCurrentTime(), minDate, maxDate;
                    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                    minDate = _xdsoft_datetime.strToDate(options.minDate);
                    minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
                    if (currentDate < minDate) {
                        return;
                    }
                    maxDate = _xdsoft_datetime.strToDate(options.maxDate);
                    maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
                    if (currentDate > maxDate) {
                        return;
                    }
                    input.val(_xdsoft_datetime.str());
                    input.trigger('change');
                    datetimepicker.trigger('close.xdsoft');
                });
            mounth_picker
                .find('.xdsoft_prev,.xdsoft_next')
                .on('touchend mousedown.xdsoft', function () {
                    var $this = $(this),
                        timer = 0,
                        stop = false;

                    (function arguments_callee1(v) {
                        if ($this.hasClass(options.next)) {
                            _xdsoft_datetime.nextMonth();
                        } else if ($this.hasClass(options.prev)) {
                            _xdsoft_datetime.prevMonth();
                        }
                        if (options.monthChangeSpinner) {
                            if (!stop) {
                                timer = setTimeout(arguments_callee1, v || 100);
                            }
                        }
                    }(500));

                    $([document.body, window]).on('touchend mouseup.xdsoft', function arguments_callee2() {
                        clearTimeout(timer);
                        stop = true;
                        $([document.body, window]).off('touchend mouseup.xdsoft', arguments_callee2);
                    });
                });

            timepicker
                .find('.xdsoft_prev,.xdsoft_next')
                .on('touchend mousedown.xdsoft', function () {
                    var $this = $(this),
                        timer = 0,
                        stop = false,
                        period = 110;
                    (function arguments_callee4(v) {
                        var pheight = timeboxparent[0].clientHeight,
                            height = timebox[0].offsetHeight,
                            top = Math.abs(parseInt(timebox.css('marginTop'), 10));
                        if ($this.hasClass(options.next) && (height - pheight) - options.timeHeightInTimePicker >= top) {
                            timebox.css('marginTop', '-' + (top + options.timeHeightInTimePicker) + 'px');
                        } else if ($this.hasClass(options.prev) && top - options.timeHeightInTimePicker >= 0) {
                            timebox.css('marginTop', '-' + (top - options.timeHeightInTimePicker) + 'px');
                        }
                        timeboxparent.trigger('scroll_element.xdsoft_scroller', [Math.abs(parseInt(timebox.css('marginTop'), 10) / (height - pheight))]);
                        period = (period > 10) ? 10 : period - 10;
                        if (!stop) {
                            timer = setTimeout(arguments_callee4, v || period);
                        }
                    }(500));
                    $([document.body, window]).on('touchend mouseup.xdsoft', function arguments_callee5() {
                        clearTimeout(timer);
                        stop = true;
                        $([document.body, window])
                            .off('touchend mouseup.xdsoft', arguments_callee5);
                    });
                });

            xchangeTimer = 0;
            // base handler - generating a calendar and timepicker
            datetimepicker
                .on('xchange.xdsoft', function (event) {
                    clearTimeout(xchangeTimer);
                    xchangeTimer = setTimeout(function () {

                        if (_xdsoft_datetime.currentTime === undefined || _xdsoft_datetime.currentTime === null) {
                            _xdsoft_datetime.currentTime = _xdsoft_datetime.now();
                        }

                        var table = '',
                            start = new Date(_xdsoft_datetime.currentTime.getFullYear(), _xdsoft_datetime.currentTime.getMonth(), 1, 12, 0, 0),
                            i = 0,
                            j,
                            today = _xdsoft_datetime.now(),
                            maxDate = false,
                            minDate = false,
                            hDate,
                            day,
                            d,
                            y,
                            m,
                            w,
                            classes = [],
                            customDateSettings,
                            newRow = true,
                            time = '',
                            h = '',
                            line_time,
                            description;

                        while (start.getDay() !== options.dayOfWeekStart) {
                            start.setDate(start.getDate() - 1);
                        }

                        table += '<table><thead><tr>';

                        if (options.weeks) {
                            table += '<th></th>';
                        }

                        for (j = 0; j < 7; j += 1) {
                            table += '<th>' + options.i18n[globalLocale].dayOfWeekShort[(j + options.dayOfWeekStart) % 7] + '</th>';
                        }

                        table += '</tr></thead>';
                        table += '<tbody>';

                        if (options.maxDate !== false) {
                            maxDate = _xdsoft_datetime.strToDate(options.maxDate);
                            maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59, 999);
                        }

                        if (options.minDate !== false) {
                            minDate = _xdsoft_datetime.strToDate(options.minDate);
                            minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
                        }

                        while (i < _xdsoft_datetime.currentTime.countDaysInMonth() || start.getDay() !== options.dayOfWeekStart || _xdsoft_datetime.currentTime.getMonth() === start.getMonth()) {
                            classes = [];
                            i += 1;

                            day = start.getDay();
                            d = start.getDate();
                            y = start.getFullYear();
                            m = start.getMonth();
                            w = _xdsoft_datetime.getWeekOfYear(start);
                            description = '';

                            classes.push('xdsoft_date');

                            if (options.beforeShowDay && $.isFunction(options.beforeShowDay.call)) {
                                customDateSettings = options.beforeShowDay.call(datetimepicker, start);
                            } else {
                                customDateSettings = null;
                            }

                            if(options.allowDateRe && Object.prototype.toString.call(options.allowDateRe) === "[object RegExp]"){
                                if(!options.allowDateRe.test(dateHelper.formatDate(start, options.formatDate))){
                                    classes.push('xdsoft_disabled');
                                }
                            } else if(options.allowDates && options.allowDates.length>0){
                                if(options.allowDates.indexOf(dateHelper.formatDate(start, options.formatDate)) === -1){
                                    classes.push('xdsoft_disabled');
                                }
                            } else if ((maxDate !== false && start > maxDate) || (minDate !== false && start < minDate) || (customDateSettings && customDateSettings[0] === false)) {
                                classes.push('xdsoft_disabled');
                            } else if (options.disabledDates.indexOf(dateHelper.formatDate(start, options.formatDate)) !== -1) {
                                classes.push('xdsoft_disabled');
                            } else if (options.disabledWeekDays.indexOf(day) !== -1) {
                                classes.push('xdsoft_disabled');
                            }

                            if (customDateSettings && customDateSettings[1] !== "") {
                                classes.push(customDateSettings[1]);
                            }

                            if (_xdsoft_datetime.currentTime.getMonth() !== m) {
                                classes.push('xdsoft_other_month');
                            }

                            if ((options.defaultSelect || datetimepicker.data('changed')) && dateHelper.formatDate(_xdsoft_datetime.currentTime, options.formatDate) === dateHelper.formatDate(start, options.formatDate)) {
                                classes.push('xdsoft_current');
                            }

                            if (dateHelper.formatDate(today, options.formatDate) === dateHelper.formatDate(start, options.formatDate)) {
                                classes.push('xdsoft_today');
                            }

                            if (start.getDay() === 0 || start.getDay() === 6 || options.weekends.indexOf(dateHelper.formatDate(start, options.formatDate)) !== -1) {
                                classes.push('xdsoft_weekend');
                            }

                            if (options.highlightedDates[dateHelper.formatDate(start, options.formatDate)] !== undefined) {
                                hDate = options.highlightedDates[dateHelper.formatDate(start, options.formatDate)];
                                classes.push(hDate.style === undefined ? 'xdsoft_highlighted_default' : hDate.style);
                                description = hDate.desc === undefined ? '' : hDate.desc;
                            }

                            if (options.beforeShowDay && $.isFunction(options.beforeShowDay)) {
                                classes.push(options.beforeShowDay(start));
                            }

                            if (newRow) {
                                table += '<tr>';
                                newRow = false;
                                if (options.weeks) {
                                    table += '<th>' + w + '</th>';
                                }
                            }
                            if(clNP!=0) {
                                table += '<td data-date="' + d + '" data-month="' + m + '" data-year="' + y + '"' + ' class="next-prev xdsoft_date xdsoft_day_of_week' + start.getDay() + ' ' + classes.join(' ') + '" title="' + description + '">' +
                                        '<div>' + d + '<div class="round-border"></div></div>' +
                                    '</td>';
                                clNP = 0;
                            }else{
                                table += '<td data-date="' + d + '" data-month="' + m + '" data-year="' + y + '"' + ' class="xdsoft_date xdsoft_day_of_week' + start.getDay() + ' ' + classes.join(' ') + '" title="' + description + '">' +
                                        '<div>' + d + '<div class="round-border"></div></div>' +
                                    '</td>';
                            }
                            if (start.getDay() === options.dayOfWeekStartPrev) {
                                table += '</tr>';
                                newRow = true;
                            }

                            start.setDate(d + 1);
                        }
                        table += '</tbody></table>';
                      
                        calendar.html(table);
                     
                       // console.log(table);

                        mounth_picker.find('.xdsoft_label span').eq(0).text(options.i18n[globalLocale].months[_xdsoft_datetime.currentTime.getMonth()]);
                        mounth_picker.find('.xdsoft_label span').eq(1).text(_xdsoft_datetime.currentTime.getFullYear());

                        // generate timebox
                        time = '';
                        h = '';
                        m = '';

                        line_time = function line_time(h, m) {
                            var now = _xdsoft_datetime.now(), optionDateTime, current_time,
                                isALlowTimesInit = options.allowTimes && $.isArray(options.allowTimes) && options.allowTimes.length;
                            now.setHours(h);
                            h = parseInt(now.getHours(), 10);
                            now.setMinutes(m);
                            m = parseInt(now.getMinutes(), 10);
                            optionDateTime = new Date(_xdsoft_datetime.currentTime);
                            optionDateTime.setHours(h);
                            optionDateTime.setMinutes(m);
                            classes = [];
                            if ((options.minDateTime !== false && options.minDateTime > optionDateTime) || (options.maxTime !== false && _xdsoft_datetime.strtotime(options.maxTime).getTime() < now.getTime()) || (options.minTime !== false && _xdsoft_datetime.strtotime(options.minTime).getTime() > now.getTime())) {
                                classes.push('xdsoft_disabled');
                            }
                            if ((options.minDateTime !== false && options.minDateTime > optionDateTime) || ((options.disabledMinTime !== false && now.getTime() > _xdsoft_datetime.strtotime(options.disabledMinTime).getTime()) && (options.disabledMaxTime !== false && now.getTime() < _xdsoft_datetime.strtotime(options.disabledMaxTime).getTime()))) {
                                classes.push('xdsoft_disabled');
                            }

                            current_time = new Date(_xdsoft_datetime.currentTime);
                            current_time.setHours(parseInt(_xdsoft_datetime.currentTime.getHours(), 10));

                            if (!isALlowTimesInit) {
                                current_time.setMinutes(Math[options.roundTime](_xdsoft_datetime.currentTime.getMinutes() / options.step) * options.step);
                            }

                            if ((options.initTime || options.defaultSelect || datetimepicker.data('changed')) && current_time.getHours() === parseInt(h, 10) && ((!isALlowTimesInit && options.step > 59) || current_time.getMinutes() === parseInt(m, 10))) {
                                if (options.defaultSelect || datetimepicker.data('changed')) {
                                    classes.push('xdsoft_current');
                                } else if (options.initTime) {
                                    classes.push('xdsoft_init_time');
                                }
                            }
                            if (parseInt(today.getHours(), 10) === parseInt(h, 10) && parseInt(today.getMinutes(), 10) === parseInt(m, 10)) {
                                classes.push('xdsoft_today');
                            }
                            time += '<div class="xdsoft_time ' + classes.join(' ') + '" data-hour="' + h + '" data-minute="' + m + '">' + dateHelper.formatDate(now, options.formatTime) + '</div>';
                        };

                        if (!options.allowTimes || !$.isArray(options.allowTimes) || !options.allowTimes.length) {
                            for (i = 0, j = 0; i < (options.hours12 ? 12 : 24); i += 1) {
                                for (j = 0; j < 60; j += options.step) {
                                    h = (i < 10 ? '0' : '') + i;
                                    m = (j < 10 ? '0' : '') + j;
                                    line_time(h, m);
                                }
                            }
                        } else {
                            for (i = 0; i < options.allowTimes.length; i += 1) {
                                h = _xdsoft_datetime.strtotime(options.allowTimes[i]).getHours();
                                m = _xdsoft_datetime.strtotime(options.allowTimes[i]).getMinutes();
                                line_time(h, m);
                            }
                        }

                        timebox.html(time);

                        opt = '';
                        i = 0;

                        for (i = parseInt(options.yearStart, 10) + options.yearOffset; i <= parseInt(options.yearEnd, 10) + options.yearOffset; i += 1) {
                            opt += '<div class="xdsoft_option ' + (_xdsoft_datetime.currentTime.getFullYear() === i ? 'xdsoft_current' : '') + '" data-value="' + i + '">' + i + '</div>';
                        }
                        yearselect.children().eq(0)
                                                .html(opt);

                        for (i = parseInt(options.monthStart, 10), opt = ''; i <= parseInt(options.monthEnd, 10); i += 1) {
                            opt += '<div class="xdsoft_option ' + (_xdsoft_datetime.currentTime.getMonth() === i ? 'xdsoft_current' : '') + '" data-value="' + i + '">' + options.i18n[globalLocale].months[i] + '</div>';
                        }
                        monthselect.children().eq(0).html(opt);
                        $(datetimepicker)
                            .trigger('generate.xdsoft');
                    }, 10);
                    event.stopPropagation();
                })
                .on('afterOpen.xdsoft', function () {
                    if (options.timepicker) {
                        var classType, pheight, height, top;
                        if (timebox.find('.xdsoft_current').length) {
                            classType = '.xdsoft_current';
                        } else if (timebox.find('.xdsoft_init_time').length) {
                            classType = '.xdsoft_init_time';
                        }
                        if (classType) {
                            pheight = timeboxparent[0].clientHeight;
                            height = timebox[0].offsetHeight;
                            top = timebox.find(classType).index() * options.timeHeightInTimePicker + 1;
                            if ((height - pheight) < top) {
                                top = height - pheight;
                            }
                            timeboxparent.trigger('scroll_element.xdsoft_scroller', [parseInt(top, 10) / (height - pheight)]);
                        } else {
                            timeboxparent.trigger('scroll_element.xdsoft_scroller', [0]);
                        }
                    }
                });

            timerclick = 0;
            calendar
                .on('touchend click.xdsoft', 'td', function (xdevent) {
                    xdevent.stopPropagation();  // Prevents closing of Pop-ups, Modals and Flyouts in Bootstrap
                    timerclick += 1;
                    var $this = $(this),
                        currentTime = _xdsoft_datetime.currentTime;

                    if (currentTime === undefined || currentTime === null) {
                        _xdsoft_datetime.currentTime = _xdsoft_datetime.now();
                        currentTime = _xdsoft_datetime.currentTime;
                    }

                    if ($this.hasClass('xdsoft_disabled')) {
                        return false;
                    }

                    currentTime.setDate(1);
                    currentTime.setFullYear($this.data('year'));
                    currentTime.setMonth($this.data('month'));
                    currentTime.setDate($this.data('date'));

                    datetimepicker.trigger('select.xdsoft', [currentTime]);

                    input.val(_xdsoft_datetime.str());

                    if (options.onSelectDate && $.isFunction(options.onSelectDate)) {
                        options.onSelectDate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), xdevent);
                    }

                    datetimepicker.data('changed', true);
                    datetimepicker.trigger('xchange.xdsoft');
                    datetimepicker.trigger('changedatetime.xdsoft');
                    if ((timerclick > 1 || (options.closeOnDateSelect === true || (options.closeOnDateSelect === false && !options.timepicker))) && !options.inline) {
                        datetimepicker.trigger('close.xdsoft');
                    }
                    setTimeout(function () {
                        timerclick = 0;
                    }, 200);
                });

            timebox
                .on('touchend click.xdsoft', 'div', function (xdevent) {
                    xdevent.stopPropagation();
                    var $this = $(this),
                        currentTime = _xdsoft_datetime.currentTime;

                    if (currentTime === undefined || currentTime === null) {
                        _xdsoft_datetime.currentTime = _xdsoft_datetime.now();
                        currentTime = _xdsoft_datetime.currentTime;
                    }

                    if ($this.hasClass('xdsoft_disabled')) {
                        return false;
                    }
                    currentTime.setHours($this.data('hour'));
                    currentTime.setMinutes($this.data('minute'));
                    datetimepicker.trigger('select.xdsoft', [currentTime]);

                    datetimepicker.data('input').val(_xdsoft_datetime.str());

                    if (options.onSelectTime && $.isFunction(options.onSelectTime)) {
                        options.onSelectTime.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), xdevent);
                    }
                    datetimepicker.data('changed', true);
                    datetimepicker.trigger('xchange.xdsoft');
                    datetimepicker.trigger('changedatetime.xdsoft');
                    if (options.inline !== true && options.closeOnTimeSelect === true) {
                        datetimepicker.trigger('close.xdsoft');
                    }
                });


            datepicker
                .on('mousewheel.xdsoft', function (event) {
                    if (!options.scrollMonth) {
                        return true;
                    }
                    if (event.deltaY < 0) {
                        _xdsoft_datetime.nextMonth();
                    } else {
                        _xdsoft_datetime.prevMonth();
                    }
                    return false;
                });

            input
                .on('mousewheel.xdsoft', function (event) {
                    if (!options.scrollInput) {
                        return true;
                    }
                    if (!options.datepicker && options.timepicker) {
                        current_time_index = timebox.find('.xdsoft_current').length ? timebox.find('.xdsoft_current').eq(0).index() : 0;
                        if (current_time_index + event.deltaY >= 0 && current_time_index + event.deltaY < timebox.children().length) {
                            current_time_index += event.deltaY;
                        }
                        if (timebox.children().eq(current_time_index).length) {
                            timebox.children().eq(current_time_index).trigger('mousedown');
                        }
                        return false;
                    }
                    if (options.datepicker && !options.timepicker) {
                        datepicker.trigger(event, [event.deltaY, event.deltaX, event.deltaY]);
                        if (input.val) {
                            input.val(_xdsoft_datetime.str());
                        }
                        datetimepicker.trigger('changedatetime.xdsoft');
                        return false;
                    }
                });

            datetimepicker
                .on('changedatetime.xdsoft', function (event) {
                    if (options.onChangeDateTime && $.isFunction(options.onChangeDateTime)) {
                        var $input = datetimepicker.data('input');
                        options.onChangeDateTime.call(datetimepicker, _xdsoft_datetime.currentTime, $input, event);
                        delete options.value;
                        $input.trigger('change');
                    }
                })
                .on('generate.xdsoft', function () {
                    if (options.onGenerate && $.isFunction(options.onGenerate)) {
                        options.onGenerate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }
                    if (triggerAfterOpen) {
                        datetimepicker.trigger('afterOpen.xdsoft');
                        triggerAfterOpen = false;
                    }
                })
                .on('click.xdsoft', function (xdevent) {
                    xdevent.stopPropagation();
                });

            current_time_index = 0;

            setPos = function () {
                /**
                 * Ð´Ñ—Â®ÐµÂ¤ÐŒÐ¸Ñ•â€œÐµâ€¦ÒÐ¶ÐŽâ€ ÐµÑšÐwindowÐ¶ÑšÐ‚ÐµÐÑ–Ð¸Ñ•â„–Ð¿Ñ˜ÐŠÐ´Ñ‘â€Ð¸Ñ•â€œÐµâ€¦ÒÐ¶ÐŽâ€ Ð·Ñ™â€žÐµÂ®Ð…ÐµÑ”Â¦ÐµÂ°ÐÐ´Ñ”Ð‹Ð¶â€”ÒÐ¶ÑšÑŸÐ¶Ð‹Â§Ð´Â»Â¶ÐµÂ®Ð…ÐµÑ”Â¦Ð¶Ñ“â€¦Ðµâ€ ÂµÐ´Ñ‘â€¹Ð¿Ñ˜ÐŠÐ¶â€”ÒÐ¶ÑšÑŸÐ¶Ð‹Â§Ð´Â»Â¶Ð¶Â˜Ñ•Ð·Â¤Ñ”Ð´Ñ‘ÐŒÐµâ€¦ÐÐ·Ñ™â€žbugÐ³Ð‚â€š
                 * Bug fixed - The datetimepicker will overflow-y when the width of the date input less than its, which
                 * could causes part of the datetimepicker being hidden.
                 * by Soon start
                 */
                var offset = datetimepicker.data('input').offset(),
                    datetimepickerelement = datetimepicker.data('input')[0],
                    top = offset.top + datetimepickerelement.offsetHeight - 1,
                    left = offset.left,
                    position = "absolute",
                    node;

                if ((document.documentElement.clientWidth - offset.left) < datepicker.parent().outerWidth(true)) {
                    var diff = datepicker.parent().outerWidth(true) - datetimepickerelement.offsetWidth;
                    left = left - diff;
                }
                /**
                 * by Soon end
                 */
                if (datetimepicker.data('input').parent().css('direction') == 'rtl')
                    left -= (datetimepicker.outerWidth() - datetimepicker.data('input').outerWidth());
                if (options.fixed) {
                    top -= $(window).scrollTop();
                    left -= $(window).scrollLeft();
                    position = "fixed";
                } else {
                    if (top + datetimepickerelement.offsetHeight > $(window).height() + $(window).scrollTop()) {
                        top = offset.top - datetimepickerelement.offsetHeight + 1;
                    }
                    if (top < 0) {
                        top = 0;
                    }
                    if (left + datetimepickerelement.offsetWidth > $(window).width()) {
                        left = $(window).width() - datetimepickerelement.offsetWidth;
                    }
                }

                node = datetimepicker[0];
                do {
                    node = node.parentNode;
                    if (window.getComputedStyle(node).getPropertyValue('position') === 'relative' && $(window).width() >= node.offsetWidth) {
                        left = left - (($(window).width() - node.offsetWidth) / 2);
                        break;
                    }
                } while (node.nodeName !== 'HTML');
                datetimepicker.css({
                    left: left,
                    top: top,
                    position: position
                });

            };
            datetimepicker
                .on('open.xdsoft', function (event) {
                    var onShow = true;
                    if (options.onShow && $.isFunction(options.onShow)) {
                        onShow = options.onShow.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), event);
                    }
                    if (onShow !== false) {
                        datetimepicker.show();
                        setPos();
                        $(window)
                            .off('resize.xdsoft', setPos)
                            .on('resize.xdsoft', setPos);

                        if (options.closeOnWithoutClick) {
                            $([document.body, window]).on('touchstart mousedown.xdsoft', function arguments_callee6() {
                                datetimepicker.trigger('close.xdsoft');
                                $([document.body, window]).off('touchstart mousedown.xdsoft', arguments_callee6);
                            });
                        }
                    }
                })
                .on('close.xdsoft', function (event) {
                    var onClose = true;
                    mounth_picker
                        .find('.xdsoft_month,.xdsoft_year')
                            .find('.xdsoft_select')
                                .hide();
                    if (options.onClose && $.isFunction(options.onClose)) {
                        onClose = options.onClose.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), event);
                    }
                    if (onClose !== false && !options.opened && !options.inline) {
                        datetimepicker.hide();
                    }
                    event.stopPropagation();
                })
                .on('toggle.xdsoft', function (event) {
                    if (datetimepicker.is(':visible')) {
                        datetimepicker.trigger('close.xdsoft');
                    } else {
                        datetimepicker.trigger('open.xdsoft');
                    }
                })
                .data('input', input);

            timer = 0;
            timer1 = 0;

            datetimepicker.data('xdsoft_datetime', _xdsoft_datetime);
            datetimepicker.setOptions(options);

            function getCurrentValue() {
                var ct = false, time;

                if (options.startDate) {
                    ct = _xdsoft_datetime.strToDate(options.startDate);
                } else {
                    ct = options.value || ((input && input.val && input.val()) ? input.val() : '');
                    if (ct) {
                        ct = _xdsoft_datetime.strToDateTime(ct);
                    } else if (options.defaultDate) {
                        ct = _xdsoft_datetime.strToDateTime(options.defaultDate);
                        if (options.defaultTime) {
                            time = _xdsoft_datetime.strtotime(options.defaultTime);
                            ct.setHours(time.getHours());
                            ct.setMinutes(time.getMinutes());
                        }
                    }
                }

                if (ct && _xdsoft_datetime.isValidDate(ct)) {
                    datetimepicker.data('changed', true);
                } else {
                    ct = '';
                }

                return ct || 0;
            }

            function setMask(options) {

                var isValidValue = function (mask, value) {
                    var reg = mask
                        .replace(/([\[\]\/\{\}\(\)\-\.\+]{1})/g, '\\$1')
                        .replace(/_/g, '{digit+}')
                        .replace(/([0-9]{1})/g, '{digit$1}')
                        .replace(/\{digit([0-9]{1})\}/g, '[0-$1_]{1}')
                        .replace(/\{digit[\+]\}/g, '[0-9_]{1}');
                    return (new RegExp(reg)).test(value);
                },
                getCaretPos = function (input) {
                    try {
                        if (document.selection && document.selection.createRange) {
                            var range = document.selection.createRange();
                            return range.getBookmark().charCodeAt(2) - 2;
                        }
                        if (input.setSelectionRange) {
                            return input.selectionStart;
                        }
                    } catch (e) {
                        return 0;
                    }
                },
                setCaretPos = function (node, pos) {
                    node = (typeof node === "string" || node instanceof String) ? document.getElementById(node) : node;
                    if (!node) {
                        return false;
                    }
                    if (node.createTextRange) {
                        var textRange = node.createTextRange();
                        textRange.collapse(true);
                        textRange.moveEnd('character', pos);
                        textRange.moveStart('character', pos);
                        textRange.select();
                        return true;
                    }
                    if (node.setSelectionRange) {
                        node.setSelectionRange(pos, pos);
                        return true;
                    }
                    return false;
                };
                if(options.mask) {
                    input.off('keydown.xdsoft');
                }
                if (options.mask === true) {
                                                        if (typeof moment != 'undefined') {
                                                                    options.mask = options.format
                                                                            .replace(/Y{4}/g, '9999')
                                                                            .replace(/Y{2}/g, '99')
                                                                            .replace(/M{2}/g, '19')
                                                                            .replace(/D{2}/g, '39')
                                                                            .replace(/H{2}/g, '29')
                                                                            .replace(/m{2}/g, '59')
                                                                            .replace(/s{2}/g, '59');
                                                        } else {
                                                                    options.mask = options.format
                                                                            .replace(/Y/g, '9999')
                                                                            .replace(/F/g, '9999')
                                                                            .replace(/m/g, '19')
                                                                            .replace(/d/g, '39')
                                                                            .replace(/H/g, '29')
                                                                            .replace(/i/g, '59')
                                                                            .replace(/s/g, '59');
                                                        }
                }

                if ($.type(options.mask) === 'string') {
                    if (!isValidValue(options.mask, input.val())) {
                        input.val(options.mask.replace(/[0-9]/g, '_'));
                        setCaretPos(input[0], 0);
                    }

                    input.on('keydown.xdsoft', function (event) {
                        var val = this.value,
                            key = event.which,
                            pos,
                            digit;

                        if (((key >= KEY0 && key <= KEY9) || (key >= _KEY0 && key <= _KEY9)) || (key === BACKSPACE || key === DEL)) {
                            pos = getCaretPos(this);
                            digit = (key !== BACKSPACE && key !== DEL) ? String.fromCharCode((_KEY0 <= key && key <= _KEY9) ? key - KEY0 : key) : '_';

                            if ((key === BACKSPACE || key === DEL) && pos) {
                                pos -= 1;
                                digit = '_';
                            }

                            while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
                                pos += (key === BACKSPACE || key === DEL) ? -1 : 1;
                            }

                            val = val.substr(0, pos) + digit + val.substr(pos + 1);
                            if ($.trim(val) === '') {
                                val = options.mask.replace(/[0-9]/g, '_');
                            } else {
                                if (pos === options.mask.length) {
                                    event.preventDefault();
                                    return false;
                                }
                            }

                            pos += (key === BACKSPACE || key === DEL) ? 0 : 1;
                            while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
                                pos += (key === BACKSPACE || key === DEL) ? -1 : 1;
                            }

                            if (isValidValue(options.mask, val)) {
                                this.value = val;
                                setCaretPos(this, pos);
                            } else if ($.trim(val) === '') {
                                this.value = options.mask.replace(/[0-9]/g, '_');
                            } else {
                                input.trigger('error_input.xdsoft');
                            }
                        } else {
                            if (([AKEY, CKEY, VKEY, ZKEY, YKEY].indexOf(key) !== -1 && ctrlDown) || [ESC, ARROWUP, ARROWDOWN, ARROWLEFT, ARROWRIGHT, F5, CTRLKEY, TAB, ENTER].indexOf(key) !== -1) {
                                return true;
                            }
                        }

                        event.preventDefault();
                        return false;
                    });
                }
            }

            _xdsoft_datetime.setCurrentTime(getCurrentValue());

            input
                .data('xdsoft_datetimepicker', datetimepicker)
                .on('open.xdsoft focusin.xdsoft mousedown.xdsoft touchstart', function (event) {
                    if (input.is(':disabled') || (input.data('xdsoft_datetimepicker').is(':visible') && options.closeOnInputClick)) {
                        return;
                    }
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        if (input.is(':disabled')) {
                            return;
                        }

                        triggerAfterOpen = true;
                        _xdsoft_datetime.setCurrentTime(getCurrentValue());
                        if(options.mask) {
                            setMask(options);
                        }
                        datetimepicker.trigger('open.xdsoft');
                    }, 100);
                })
                .on('keydown.xdsoft', function (event) {
                    var val = this.value, elementSelector,
                        key = event.which;
                    if ([ENTER].indexOf(key) !== -1 && options.enterLikeTab) {
                        elementSelector = $("input:visible,textarea:visible,button:visible,a:visible");
                        datetimepicker.trigger('close.xdsoft');
                        elementSelector.eq(elementSelector.index(this) + 1).focus();
                        return false;
                    }
                    if ([TAB].indexOf(key) !== -1) {
                        datetimepicker.trigger('close.xdsoft');
                        return true;
                    }
                })
                .on('blur.xdsoft', function () {
                    datetimepicker.trigger('close.xdsoft');
                });
        };
        destroyDateTimePicker = function (input) {
            var datetimepicker = input.data('xdsoft_datetimepicker');
            if (datetimepicker) {
                datetimepicker.data('xdsoft_datetime', null);
                datetimepicker.remove();
                input
                    .data('xdsoft_datetimepicker', null)
                    .off('.xdsoft');
                $(window).off('resize.xdsoft');
                $([window, document.body]).off('mousedown.xdsoft touchstart');
                if (input.unmousewheel) {
                    input.unmousewheel();
                }
            }
        };
        $(document)
            .off('keydown.xdsoftctrl keyup.xdsoftctrl')
            .on('keydown.xdsoftctrl', function (e) {
                if (e.keyCode === CTRLKEY) {
                    ctrlDown = true;
                }
            })
            .on('keyup.xdsoftctrl', function (e) {
                if (e.keyCode === CTRLKEY) {
                    ctrlDown = false;
                }
            });

        this.each(function () {
            var datetimepicker = $(this).data('xdsoft_datetimepicker'), $input;
            if (datetimepicker) {
                if ($.type(opt) === 'string') {
                    switch (opt) {
                    case 'show':
                        $(this).select().focus();
                        datetimepicker.trigger('open.xdsoft');
                        break;
                    case 'hide':
                        datetimepicker.trigger('close.xdsoft');
                        break;
                    case 'toggle':
                        datetimepicker.trigger('toggle.xdsoft');
                        break;
                    case 'destroy':
                        destroyDateTimePicker($(this));
                        break;
                    case 'reset':
                        this.value = this.defaultValue;
                        if (!this.value || !datetimepicker.data('xdsoft_datetime').isValidDate(dateHelper.parseDate(this.value, options.format))) {
                            datetimepicker.data('changed', false);
                        }
                        datetimepicker.data('xdsoft_datetime').setCurrentTime(this.value);
                        break;
                    case 'validate':
                        $input = datetimepicker.data('input');
                        $input.trigger('blur.xdsoft');
                        break;
                    default:
                        if (datetimepicker[opt] && $.isFunction(datetimepicker[opt])) {
                            result = datetimepicker[opt](opt2);
                        }
                    }
                } else {
                    datetimepicker
                        .setOptions(opt);
                }
                return 0;
            }
            if ($.type(opt) !== 'string') {
                if (!options.lazyInit || options.open || options.inline) {
                    createDateTimePicker($(this));
                } else {
                    lazyInit($(this));
                }
            }
        });

        return result;
    };
    $.fn.datetimepicker.defaults = default_options;

    function HighlightedDate(date, desc, style) {
        "use strict";
        this.date = date;
        this.desc = desc;
        this.style = style;
    }

}));
/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));