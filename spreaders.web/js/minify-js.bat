
cd C:\Github\spreaders\spreaders.web\js
java -jar compiler.jar --js ^
scripts/namespaces.js ^
scripts/maths.js ^
scripts/model/group.js ^
scripts/model/person.js ^
scripts/model/personTotal.js ^
scripts/model/transaction.js ^
scripts/view/personFormList.js ^
scripts/view/addPerson.js ^
scripts/view/editablePerson.js ^
scripts/view/payeeCheckboxes.js ^
scripts/view/payerRadio.js ^
scripts/view/transaction.js ^
scripts/pageContext.js ^
scripts/urlService.js ^
scripts/apiService.js ^
scripts/storageIndexedDb.js ^
scripts/storage.js ^
scripts/synchroniser.js ^
scripts/observer.js ^
--js_output_file live/library.js ^
--compilation_level SIMPLE

java -jar compiler.jar --js ^
pages/groups.js ^
--js_output_file live/pages/groups.js ^
--compilation_level SIMPLE

java -jar compiler.jar --js ^
pages/people.js ^
--js_output_file live/pages/people.js ^
--compilation_level SIMPLE

java -jar compiler.jar --js ^
pages/person.js ^
--js_output_file live/pages/person.js ^
--compilation_level SIMPLE

java -jar compiler.jar --js ^
pages/transaction.js ^
--js_output_file live/pages/transaction.js ^
--compilation_level SIMPLE

java -jar compiler.jar --js ^
pages/transactions.js ^
--js_output_file live/pages/transactions.js ^
--compilation_level SIMPLE
