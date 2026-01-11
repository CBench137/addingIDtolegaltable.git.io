/* ============================================
   Sample Data Module
   ============================================ */

/**
 * Load sample Nepali legal text
 */
function loadSampleNepali() {
    const sampleText = `४.
प्रमाण बुझ्न नपर्ने कुराहरुः
(१) देहायका कुनै कुराका सम्बन्धमा प्रमाण बुझ्न पर्दैनः–
(क) मुद्दाको कुनै पक्षले व्यक्त गरेको कुनै कुरा अर्को पक्षले लिखित रुपमा स्वीकार गरेमा सो स्वीकार गरेको कुरा,
तर अदालतले उपयुक्त ठानेमा त्यस्तो कुराका सम्बन्धमा पनि प्रमाण बुझ्न सक्नेछ ।
स्पष्टीकरणः यस दफाको प्रयोजनका लागि "लिखित" भन्नाले इलेक्ट्रोनिक रुपमा गरिएको सञ्चार समेत सम्झनु पर्छ ।

५.
अदालतले स्वयं जानकारी लिने कुराहरुः
(१) अदालतले देहायका कुराहरुको स्वयं न्यायिक जानकारी लिनु पर्छः–
(क) नेपालको इलाका,
(ख) नेपालको संविधान र नेपाल कानून,
(ग) नेपालको राष्ट्रिय झण्डा,
(ग१) नेपालको राष्ट्रिय गान,
(ग२) नेपालको निशान छाप,
(घ) राष्ट्रपतिको शपथ,
(ङ) विधेयकको प्रमाणीकरण मिति,
(च) नेपाल राजपत्रमा प्रकाशित सूचनाहरु ।
(२) अदालतले विवादको विषय हुन नसक्ने सामान्य ज्ञानका कुराहरुको स्वयं न्यायिक जानकारी लिन हुन्छ ।
तर यस उपदफा अनुसार मुद्दाको कुनै पक्षले कुनै कुराको न्यायिक जानकारी लिन अदालतलाई अनुरोध गरेमा अदालतले त्यस सम्बन्धमा आवश्यक प्रमाण पेश गर्न सो पक्षलाई आदेश दिन सक्नेछ ।`;
    
    document.getElementById('legalText').value = sampleText;
}

/**
 * Load sample English legal text
 */
function loadSampleEnglish() {
    const sampleText = `4.
Evidence Not Required
(1) Evidence shall not be required for the following matters:
(a) Any matter expressed by a party which has been accepted in writing by another party,
Provided that the court may require evidence even for such matters if deemed appropriate.
Explanation: For the purposes of this section, "written" includes electronic communication.

5.
Examination of Witnesses
(1) Witnesses shall be examined as may be necessary.
(a) Examination-in-chief
(b) Cross-examination
(c) Re-examination
Provided further that no unnecessary hardship shall be caused to the witness.
(2) All evidence shall be recorded in accordance with the procedure prescribed.
Provided that the court may allow supplementary recording if necessary.`;
    
    document.getElementById('legalText').value = sampleText;
}

/**
 * Clear input textarea
 */
function clearInput() {
    if (confirm('Clear the input text? This will not affect the generated table.')) {
        document.getElementById('legalText').value = '';
        document.getElementById('legalText').focus();
    }
}
