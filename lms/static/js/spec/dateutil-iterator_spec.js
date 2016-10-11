define(['../dateutil-iterator.js', 'moment-with-locales'], function(DateUtilIterator, MomentLoc) {
    'use strict';

    describe('DateUtilIterator', function() {
        beforeEach(function() {
            setFixtures('<div class="test"></div>');
        });

        describe('stringHandler', function() {
            it('returns a complete string', function() {
                var localTimeString = 'RANDOM_STRING';
                var sidecarString = 'RANDOM_STRING_TWO';
                var answer = 'RANDOM_STRING_TWO RANDOM_STRING';
                expect(DateUtilIterator.stringHandler(localTimeString, sidecarString)).toEqual(answer);
            });
        });

        // describe('localizedTime', function() {
        //     var context;
        //     it('returns an empty string if provided no time', function() {
        //         context = {}
        //         expect(DateUtilIterator.localizedTime(context)).toEqual('');
        //     });
        //     it('returns a timezone formatted string', function() {
        //         var TestLangs = {
        //             en: 'Oct 14, 2016 08:00 UTC',
        //             ru: '14 окт. 2016 г. 08:00 UTC',
        //             ar: '١٤ تشرين الأول أكتوبر ٢٠١٦ ٠٨:٠٠ UTC',
        //             fr: 'FARTFART'
        //         };
        //         Object.keys(TestLangs).forEach(function(key) {
        //             console.log(key);
        //             var context = {
        //                 datetime: '2016-10-14 08:00:00+00:00',
        //                 timezone: 'UTC',
        //                 language: String(key)
        //             };
        //             console.log(context);
        //             expect(DateUtilIterator.localizedTime(context)).toEqual(TestLangs[key]);
        //         });
        //     });
        // });
        describe('transform', function() {
            // describe(function(){
            var form;

            // beforeEach(function(){});
            it('localizes some times', function() {
                /* we have to generate a fake span and then test the resultant texts */
                var iterationKey = '.localized-datetime';
                var TestLangs = {
                    en: 'due Oct 14, 2016 08:00 UTC',
                    ru: '14 окт. 2016 г. 08:00 UTC',
                    ar: '١٤ تشرين الأول أكتوبر ٢٠١٦ ٠٨:٠٠ UTC',
                    fr: '14 окт. 2016 г. 08:00 UTC'
                };
                var form = $('<span class="subtitle-name localized-datetime" data-timezone="UTC" data-datetime="2016-10-14 08:00:00+00:00" data-string="due"></span>');
                debugger;
                Object.keys(TestLangs).forEach(function(key) {
                    form.attr('lang', String(key));
                    $(document.body).append(form);

                    DateUtilIterator.transform(iterationKey);
                    expect(form.text()).toEqual(TestLangs[key]);

                    form.remove();
                });
                form = null;
            });
        });
    });
});
