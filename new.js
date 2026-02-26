
RUN="new.js";

demo();

async function demo() {
  var name = await input("\nName: ");
  var pass = await input({ prompt: "\nPassword: ", mask: true });
  print("\nHello " + name + "\n");
  print("\nYour password length is " + pass.length + "\n");
  RUN="qandy.js";
}
 
