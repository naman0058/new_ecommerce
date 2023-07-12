using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace YourNamespace
{
    public class UserController : ApiController
    {
        private List<User> users = new List<User>();

        // GET api/user
        public IEnumerable<User> Get()
        {
            return users;
        }

        // GET api/user/{id}
        public IHttpActionResult Get(int id)
        {
            var user = users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        // POST api/user
        public IHttpActionResult Post(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }
            user.Id = users.Count + 1;
            users.Add(user);
            return CreatedAtRoute("DefaultApi", new { id = user.Id }, user);
        }

        // PUT api/user/{id}
        public IHttpActionResult Put(int id, User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }
            var existingUser = users.FirstOrDefault(u => u.Id == id);
            if (existingUser == null)
            {
                return NotFound();
            }
            existingUser.Name = user.Name;
            existingUser.Email = user.Email;
            return StatusCode(HttpStatusCode.NoContent);
        }

        // DELETE api/user/{id}
        public IHttpActionResult Delete(int id)
        {
            var user = users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return NotFound();
            }
            users.Remove(user);
            return StatusCode(HttpStatusCode.NoContent);
        }
    }

    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
